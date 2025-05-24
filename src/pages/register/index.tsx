import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/api/auth/use-register';
import { registerSchema, RegisterSchema } from '@/shemas';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
	const { mutate, isPending } = useRegister();
	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: RegisterSchema) => {
		mutate(values);
	};

	return (
		<Card className="size-full md:w-[487px] border-none shadow-none">
			<CardHeader className="flexx items-center justify-center text-center p-7">
				<CardTitle className="text-2xl">Регистрация</CardTitle>
			</CardHeader>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} type="text" placeholder="Введите ФИО" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} type="email" placeholder="Введите email" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} type="password" placeholder="Введите пароль" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" size="lg" disabled={isPending}>
							Зарегистрироваться
						</Button>
					</form>
				</Form>
			</CardContent>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7 flex items-center justify-center">
				<p>
					Уже есть аккаунт?
					<Link to="/login">
						<span className="text-blue-700">&nbsp;Войти</span>
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};
