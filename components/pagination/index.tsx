import React, { useEffect, useState } from "react";
import { clsx } from "clsx";

type Props = {
  paginate: {
    current: number | string;
    totalPages: number;
    perPage: number | null;
    totalRecords: number | null;
    recordsOnPage: number | null;
  };
  onPageChange: (page: number) => void;
  limit: number | string;
};

export default function Pagination({
  paginate,
  onPageChange,
  limit = 1,
}: Props) {
  const { totalPages, current } = paginate;
  const [rangePage, setRangePage] = useState([]);
  const [previus, setPrevius] = useState(1);
  const [next, setNext] = useState(1);

  useEffect(() => {
    setPrevius(current === 1 ? 1 : Number(current) - 1);
    setNext(current === totalPages ? totalPages : Number(current) + 1);
    pageRange();
  }, [current, totalPages]);

  const pageRange = () => {
    let range = [];
    let pages: any = [];
    let l: any;
    var left = Number(current) - Number(limit);
    var right = Number(current) + Number(limit) + 1;
    for (var i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        range.push(i);
      }
    }
    range.forEach(function (i) {
      if (l) {
        if (i - l === 2) {
          pages.push(l + 1);
        } else if (i - l !== 1) {
          pages.push("...");
        }
      }
      pages.push(i);
      l = i;
    });
    //set state
    setRangePage(pages);
  };
  return (
    <nav>
      <ul className="flex items-center justify-center m-2">
        <li className="page-item">
          <button
            className={clsx(
              "relative block px-3 py-1 border text-slate-500 text-xl rounded-l-md dark:border-slate-500"
            )}
            onClick={() => onPageChange(Number(previus))}
            disabled={Number(current) === 1}
          >
            <span aria-hidden="true">«</span>
            <span className="sr-only">Previous</span>
          </button>
        </li>
        {rangePage?.map((link: any, index: any) => (
          <li className="page-item" key={index}>
            <button
              className={clsx("relative block px-3 py-1 border text-xl", {
                ["text-slate-100 bg-red-800 border-red-800 cursor-default"]:
                  current === link,
                ["text-red-800 bg-white hover:text-white hover:border-red-800 hover:bg-red-800 dark:bg-slate-800 dark:border-slate-500"]:
                  current !== link,
              })}
              onClick={() => onPageChange(Number(link))}
            >
              {link}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            className={clsx(
              "relative block px-3 py-1 border text-slate-500 text-xl rounded-r-md dark:border-slate-500"
            )}
            onClick={() => onPageChange(Number(next))}
            disabled={Number(totalPages) === Number(current)}
          >
            <span aria-hidden="true">»</span>
            <span className="sr-only">Next</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
