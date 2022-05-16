import logo from "./logo.png";
import useSWR from "swr";
import axios from "axios";
import genToken from "./_gentoken";
import { useState, useEffect } from "react";

const client_secret = process.env.REACT_APP_CLIENT_SECRET;

function Flow() {
  const fetcher = (url) =>
    genToken()
      .then((token) =>
        axios
          .get(url, {
            headers: {
              "Client-Secret": client_secret,
              // Host: "api.eksisozluk.com",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data)
      )
      .then((data) => data);
  const page_idx = 7279099;
  const last_page = 58;

  const { data, error } = useSWR(
    `https://api.eksisozluk.com/v2/topic/${page_idx}/?p=${last_page}`,
    fetcher,
    { refreshInterval: 1500 }
  );

  if (!data) {
    return (
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    console.log(error.response.data);
    return <div>failed to load</div>;
  }

  let rdate = (dt) => {
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

  return (
    <div className="content-root">
      <SideBar />
      <div className="content">
        <header>
          <div className="title">
            <a
              rel="noreferrer"
              target="_blank"
              href={
                "https://eksisozluk.com/" + data.Data.Slug + "--" + data.Data.Id
              }
            >
              {data.Data.Title}
            </a>
          </div>
        </header>
        <div className="flow-box">
          <ul>
            {data &&
              data.Data.Entries.map((entry) => (
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
                        {rdate(entry.Created)}
                      </a>
                    </div>
                  </footer>
                </div>
              ))}
          </ul>
        </div>
        {/* <div className="flow-box-footer"></div> */}
      </div>
    </div>
  );
}

function SideBar() {
  const body = {
    Filters: [
      {
        channelId: 1,
        channelName: "spor",
        enabled: true,
      },
      {
        channelId: 2,
        channelName: "siyaset",
        enabled: true,
      },
      {
        channelId: 4,
        channelName: "anket",
        enabled: true,
      },
      {
        channelId: 5,
        channelName: "ilixc5x9fkiler",
        enabled: true,
      },
      {
        channelId: 10,
        channelName: "ekxc5x9fi-sxc3xb6zlxc3xbck",
        enabled: true,
      },
      {
        channelId: 11,
        channelName: "yetixc5x9fkin",
        enabled: false,
      },
      {
        channelId: 39,
        channelName: "troll",
        enabled: false,
      },
    ],
  };

  const fetcher = (url) =>
    genToken()
      .then((token) =>
        axios
          .post(url, body, {
            headers: {
              "Client-Secret": client_secret,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json; charset=UTF-8",
              // Host: "api.eksisozluk.com",
            },
          })
          .then((res) => res.data)
      )
      .then((data) => data);

  const { data } = useSWR(
    `https://api.eksisozluk.com/v2/index/popular/?p=1`,
    fetcher
  );

  const [topicid, setTopicid] = useState(false);
  useEffect(() => {
    console.log(topicid);
    // this.setState({ topicid: topicid });
  }, [topicid]);

  return (
    <div className="side-bar">
      <a href="https://eksiflow.vercel.app/">
        <div className="logo">
          <img src={logo} alt="ekşiflow logo" height="29px" />
        </div>
      </a>
      <ul>
        {data &&
          data.Data.Topics.map((topic) => (
            <li
              key={topic.TopicId}
              onClick={() => setTopicid(topic.TopicId)}
              className="topic"
            >
              {topic.Title} <span>({topic.MatchedCount})</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Flow;
