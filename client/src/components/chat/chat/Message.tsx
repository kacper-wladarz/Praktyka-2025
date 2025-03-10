import React from "react";

const Message = ({ message }: { message: Message }) => {
    console.log(message);
    return (
        <React.Fragment>
            {message.userId === null ? (
                <div className="text-left max-w-5/6">{message.body}</div>
            ) : (
                <div className="max-w-2/3 ml-auto bg-zinc-800 p-4 rounded-lg shadow-[0px_0px_12px_-4px_rgb(0,0,0)]">
                    {message.body}
                </div>
            )}
        </React.Fragment>
    );
};

export default Message;
