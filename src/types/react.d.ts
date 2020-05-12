import { ReactNode, FormEvent } from 'react';

declare interface ChildrenProps {
	children: ReactNode;
}

declare interface OnClickProps {
	onClick: (event: FormEvent<HTMLButtonElement>) => void;
}

declare interface ClassNameProps {
	className?: string | null;
}
