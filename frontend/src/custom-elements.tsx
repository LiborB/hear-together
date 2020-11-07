import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	outlined?: boolean;
}
export function Button(props: ButtonProps) {
	const { outlined, ...slicedProps } = props;
	return !outlined ? (
		<button
			{...slicedProps}
			className={`bg-teal-400 focus:outline-none text-black px-4 py-1 hover:bg-teal-300 ${slicedProps.className}`}
		></button>
	) : (
		<button
			{...slicedProps}
			className={`bg-transparent focus:outline-none border border-teal-400 hover:text-teal-300 hover:border-teal-300 text-teal-300 px-4 py-1 ${slicedProps.className}`}
		></button>
	);
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
}
export function Input(props: InputProps) {
	const { error, ...slicedProps } = props;
	return props.error ? (
		<input
			{...slicedProps}
			className={`px-3 py-3 rounded-md bg-gray-800 border-red-500 text-red-500 border-2 outline-none placeholder-red-500 w-full ${slicedProps.className}`}
		></input>
	) : (
		<input
			{...slicedProps}
			className={`px-3 py-3 rounded-md bg-gray-800 border-gray-800 text-white focus:border-teal-300 border-2 outline-none placeholder-white w-full ${slicedProps.className}`}
		></input>
	);
}

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {}
export function FormError(props: FormErrorProps) {
	return (
		<span
			{...props}
			className={`text-red-500 text-xs px-3 ${props.className}`}
		></span>
	);
}
