import "./Loading.css";

type LoadingProps = {
	className?: string;
};

function Loading({ className }: LoadingProps) {
	return <div className={className + " loader"}></div>;
}

export default Loading;
