import { useMutation } from "@tanstack/react-query";
import { FunctionComponent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deletePoll } from "../api";

type PollButtonsProps = {
  isOwner: boolean;
  handleResultRefetch: () => Promise<any>;
};

export const PollButtons: FunctionComponent<PollButtonsProps> = ({
  isOwner,
  handleResultRefetch,
}) => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [refreshed, setRefreshed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePollMutation = useMutation({
    mutationFn: () => deletePoll({ params: { id: pollId } }),
  });

  const handlePollDeletion = () => {
    deletePollMutation
      .mutateAsync()
      .then(() => navigate("/"))
      .catch(() => setError("Some error happened, try again!"));
  };

  if (isClosing) {
    return (
      <>
        Close poll?
        <button className="bg-red-500 rounded-md px-4 py-2 font-bold text-zinc-200 hover:brightness-90">
          Yes
        </button>
        <button
          className="bg-sky-500 rounded-md px-4 py-2 font-bold text-zinc-200 hover:brightness-90"
          onClick={() => setIsClosing(false)}
        >
          No
        </button>
      </>
    );
  }

  if (isDeleting) {
    return (
      <>
        Delete poll?
        <button
          className="bg-red-500 rounded-md px-4 py-2 font-bold text-zinc-200 hover:brightness-90"
          onClick={() => handlePollDeletion()}
        >
          {deletePollMutation.isLoading ? "Deleting" : "Yes"}
        </button>
        <button
          className="bg-sky-500 rounded-md px-4 py-2 font-bold text-zinc-200 hover:brightness-90"
          onClick={() => setIsDeleting(false)}
        >
          No
        </button>
      </>
    );
  }

  return (
    <div className="w-full">
      <div className="flex mx-auto gap-2 max-w-3xl justify-between items-center">
        <div>
          <button
            className="p-2 bg-green-500 rounded-md hover:brightness-90"
            onClick={() =>
              handleResultRefetch().then(() => {
                setRefreshed(true);
                setTimeout(() => setRefreshed(false), 1000);
              })
            }
          >
            {refreshed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-zinc-100 fill-transparent h-6"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-zinc-100 fill-transparent h-6"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
              </svg>
            )}
          </button>
        </div>
        {isOwner && (
          <div className="flex flex-grow gap-4 justify-end">
            <button
              onClick={() => setIsClosing(true)}
              className="font-bold bg-sky-500 px-4 py-2 rounded-md text-zinc-100 hover:brightness-90 outline outline-2 outline-offset-4 outline-transparent focus:outline-sky-500"
            >
              Close poll
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              className="font-bold bg-red-500 px-4 py-2 rounded-md text-zinc-100 hover:brightness-90 outline outline-2 outline-offset-4 outline-transparent focus:outline-red-500"
            >
              Delete poll
            </button>
          </div>
        )}
      </div>
    </div>
  );
};