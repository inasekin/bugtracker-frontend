import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { useComments, useComment } from '@/api/comments';

export type TaskCommentsProps = {
	taskId: string;
	userId: string;
};

export const TaskComments = ({ taskId, userId }: TaskCommentsProps) => {
	const [refreshId, setRefreshId] = useState(Date.now().toString());
	const { comments } = useComments(taskId, refreshId);
	const { comment, setComment, updateComment, deleteCommentById } = useComment('');

	const commentsList = [] as React.ReactElement[];
	if (comments) {
		comments.forEach((comment) => {
			commentsList.push(
				<div key={comment.id} className="flex flex-col m-2">
					<div>{comment.content}</div>
					<div className="flex flex-row justify-end m-2">
						<div>
							<b>
								{new Date(comment.updatedAtTime).toLocaleDateString()}&nbsp;
								{new Date(comment.updatedAtTime).toLocaleTimeString()}&nbsp;
							</b>
						</div>
						<Button
							variant={'destructive'}
							onClick={() => deleteCommentButton(comment.id)}
						>
							Удалить комментарий
						</Button>
					</div>
				</div>,
			);
		});
	}

	const addComment = async () => {
		const commentWithUser = { ...comment, issueId: taskId, authorId: userId };
		await updateComment(commentWithUser);
		const commentEmpty = { ...comment, content: '', id: '' };
		setComment(commentEmpty);
		setRefreshId(Date.now().toString());
	};

	const deleteCommentButton = async (commentId: string) => {
		await deleteCommentById(commentId);
		const commentEmpty = { ...comment, content: '', id: '' };
		setComment(commentEmpty);
		setRefreshId(Date.now().toString());
	};

	const setCommentContent = (str: string) => setComment({ ...comment, content: str });

	return (
		<Card>
			<CardHeader>Комментарии:</CardHeader>
			<CardContent>
				<div>{commentsList}</div>

				<div className="flex flex-col space-y-4 m-2">
					<Label htmlFor="description">Новый комментарий</Label>
					<Textarea
						value={comment.content}
						onChange={(e) => setCommentContent(e.target.value)}
					/>
				</div>
				<Button className="m-2" onClick={() => addComment()}>
					Добавить комментарий...
				</Button>
			</CardContent>
		</Card>
	);
};
