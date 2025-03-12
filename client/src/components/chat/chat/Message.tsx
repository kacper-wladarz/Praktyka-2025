import ReactMarkdown from "react-markdown";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import "katex/dist/katex.min.css";

const Message = ({ message }: { message: MessageData }) => {
    return (
        <MathJaxContext>
            {message.userId === null ? (
                <div className="chat_response text-left max-w-full p-6 rounded-lg ">
                    <MathJax>
                        <ReactMarkdown>{message.body}</ReactMarkdown>
                    </MathJax>
                </div>
            ) : (
                <div className="max-w-2/3 ml-auto text-white bg-zinc-800 p-4 rounded-lg shadow-[0px_0px_12px_-4px_rgb(0,0,0)]">
                    {message.body}
                </div>
            )}
        </MathJaxContext>
    );
};

export default Message;
