import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  outlined?: boolean;
}
export function Button(props: ButtonProps) {
  const { outlined, ...slicedProps } = props;
  return !outlined ? (
    <button
      {...slicedProps}
      className={`bg-primary focus:outline-none text-black px-4 py-1 hover:bg-primary ${slicedProps.className}`}
    ></button>
  ) : (
    <button
      {...slicedProps}
      className={`bg-transparent focus:outline-none border border-teal-400 hover:text-primary hover:border-primary text-teal-400 px-4 py-1 ${slicedProps.className}`}
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
      className={`px-3 py-3 rounded-md bg-gray-800 border-red-500 text-red-500 border outline-none placeholder-red-500 w-full ${slicedProps.className}`}
    ></input>
  ) : (
    <input
      {...slicedProps}
      className={`px-3 py-3 rounded-md bg-gray-800 border-gray-800 focus:border-primary border outline-none w-full ${slicedProps.className}`}
    ></input>
  );
}

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export function TextArea(props: TextAreaProps) {
  const { error, ...slicedProps } = props;
  return props.error ? (
    <textarea
      {...slicedProps}
      className={`px-3 py-3 rounded-md bg-gray-800 border-red-500 text-red-500 border outline-none placeholder-red-500 w-full ${slicedProps.className}`}
    ></textarea>
  ) : (
    <textarea
      {...slicedProps}
      className={`px-3 py-3 rounded-md bg-gray-800 border-gray-800 focus:border-primary border outline-none w-full ${slicedProps.className}`}
    ></textarea>
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

export interface IResponseMessage {
  error: boolean;
  message: string;
}
interface ResponseMessageProps {
  responseMessage: IResponseMessage;
}
export function ResponseMessage(props: ResponseMessageProps) {
  let className: string;
  if (props.responseMessage.error) {
    className = "text-red-400";
  } else {
    className = "text-green-400";
  }

  return <div className={className}>{props.responseMessage.message}</div>;
}
