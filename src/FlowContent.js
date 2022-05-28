/* eslint-disable react-hooks/exhaustive-deps */
import useSWR from "swr";
import axios from "axios";
import genToken from "./gentoken";
import { useState, useEffect, useRef } from "react";

const client_secret = process.env.REACT_APP_CLIENT_SECRET;

export default function FlowContent({ pageidx }) {
  const fetcher = (url) =>
    genToken()
      .then((token) =>
        axios
          .get(url, {
            headers: {
              "Client-Secret": client_secret,
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data)
      )
      .then((data) => data);

  const footerDiv = useRef(null);
  const [lastPage, setLastPage] = useState("1");
  const [entryPool, setEntryPool] = useState({});

  const { data, error } = useSWR(
    `https://api.eksisozluk.com/v2/topic/${pageidx}/?p=${
      lastPage !== "1" ? parseInt(lastPage) : 1
    }`,
    fetcher,
    { refreshInterval: 1000 }
  );

  let pageUrl =
    "https://eksisozluk.com/" + data?.Data.Slug + "--" + data?.Data.Id;

  useEffect(() => {
    setEntryPool({});
  }, [pageidx]);

  useEffect(() => {
    setLastPage(data ? data.Data.PageCount : "1");
    if (data) setEntryPool({ ...entryPool, [lastPage]: data.Data.Entries });
    // console.log(entryPool);
  }, [data]);

  // useEffect(() => {
  //   footerDiv?.current?.scrollIntoView();
  // });

  if (error) return <div>error</div>;
  return (
    <>
      <div className="main-header">
        <a rel="noreferrer" target="_blank" href={pageUrl}>
          {data?.Data.Title}
        </a>
      </div>
      <div className="main-container">
        <ul>
          {Object.entries(entryPool).map(([page, entries]) => (
            <div className="entry-page" key={page}>
              {page !== "1" ? (
                <div className="pager">
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={pageUrl + "?p=" + page}
                  >
                    <span>{page}. sayfa ↓</span>
                  </a>
                </div>
              ) : null}
              {entries.map((entry) => (
                <div className="entry" key={entry.Id}>
                  <li>
                    <div className="content">{entry.Content}</div>
                  </li>
                  <footer>
                    <div className="entry-author">
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href={
                          "https://eksisozluk.com/biri/" +
                          entry.Author.Nick.replace(" ", "-")
                        }
                      >
                        {entry.Author.Nick}
                      </a>
                    </div>
                    <div className="entry-date">
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href={"https://eksisozluk.com/entry/" + entry.Id}
                      >
                        {entrydate(entry.Created)}
                      </a>
                    </div>
                  </footer>
                </div>
              ))}
              {page === "1" ? (
                <>
                  {" "}
                  <div className="pager">
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={pageUrl + "?p=" + page}
                    >
                      <span>1. sayfa ↑</span>
                    </a>
                  </div>
                  <div className="threeDot">...</div>
                </>
              ) : null}
            </div>
          ))}
        </ul>
        <div className="main-container-footer" ref={footerDiv}></div>
      </div>
    </>
  );
}

const entrydate = (dt) => {
  const diff = new Date(Date.now() - new Date(dt));
  const dy = Math.floor(diff.getTime() / (1000 * 3600 * 24));
  if (dy > 0) return `${dy} gün önce`;
  const hr = Math.floor(diff.getTime() / (1000 * 3600));
  if (hr > 0) return `${hr} saat önce`;
  const mn = Math.floor(diff.getTime() / (1000 * 60));
  if (mn > 0) return `${mn} dk`;
  const sc = Math.floor(diff.getTime() / 1000);
  return sc > 0 ? `${sc} sn` : "şimdi";
};

// const processContent = (entry) => {
//   let output;
//   output = entry.match(/`(.*)`/);
//   return output;
// };
