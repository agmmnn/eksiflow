import useSWR from "swr";
import axios from "axios";
import genToken from "./_gentoken";
import { useState, useEffect } from "react";

const client_secret = process.env.REACT_APP_CLIENT_SECRET;

export default function FlowEntryList({ pageidx }) {
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

  const [lastPage, setLastPage] = useState("1");

  const { data, error } = useSWR(
    `https://api.eksisozluk.com/v2/topic/${pageidx}/?p=${lastPage}`,
    fetcher,
    { refreshInterval: 1500 }
  );

  useEffect(() => setLastPage(data ? data.Data.PageCount : "1"), [data]);

  if (error) return <div>error</div>;
  return (
    <>
      <div className="main-header">
        <a
          rel="noreferrer"
          target="_blank"
          href={
            "https://eksisozluk.com/" + data?.Data.Slug + "--" + data?.Data.Id
          }
        >
          {data?.Data.Title}
        </a>
      </div>
      <div className="main-container">
        <ul>
          <div className="pager">
            <span>{lastPage}. sayfa 💫</span>
          </div>
          {data?.Data.Entries.map((entry) => (
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
        </ul>
      </div>
    </>
  );
}

const entrydate = (dt) => {
  const d = new Date(dt);
  const n = Date.now();
  const diff = new Date(n - d);
  const mn = Math.floor(diff.getTime() / (1000 * 60));
  const sn = Math.floor(diff.getTime() / 1000);
  if (mn && mn > 0) {
    return `${mn} dk`;
  } else if (sn > 0) {
    return `${sn} sn`;
  } else {
    return "now";
  }
};
