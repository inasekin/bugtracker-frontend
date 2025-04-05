
export type ColumnCommand = {
  name: string,
  variant: string,
  action: React.MouseEvent<HTMLButtonElement, MouseEvent>
};

export type ItemAction = (record: string) => any;
