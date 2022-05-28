import useSWR from "swr";
import axios from "axios";
import genToken from "./gentoken";
import FlowContent from "./FlowContent";
import { useState } from "react";

const client_secret = process.env.REACT_APP_CLIENT_SECRET;

export const Flow = () => {
  const fetcher = (url) =>
    genToken()
      .then((token) =>
        axios
          .post(url, post_body, {
            headers: {
              "Client-Secret": client_secret,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json; charset=UTF-8",
            },
          })
          .then((res) => res.data)
      )
      .then((data) => data);

  const { data } = useSWR(
    `https://api.eksisozluk.com/v2/index/popular`,
    fetcher
  );

  const [topicid, setTopicid] = useState(false);

  const localTheme = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : "light";
  const [theme, setTheme] = useState(localTheme);
  const changeTheme = () => {
    const currentTheme = localTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    setTheme(currentTheme);
  };

  return (
    <>
      {/* sidebar */}
      <div className="sidebar">
        <span className="logo"></span>
        <a className="logo-expand" href="https://eksiflow.vercel.app/">
          <img src="logo.svg" alt="ekşiflow logo" />
        </a>
        <div className="side-wrapper">
          <div className="side-title">
            gündem
            <svg
              fill="#808191"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              width="20px"
              height="20px"
              onClick={() => console.log("refresh")}
            >
              <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z" />
            </svg>
          </div>
          <div className="side-menu">
            {data?.Data.Topics.map((topic) => (
              <li
                key={topic.TopicId}
                onClick={() => setTopicid(topic.TopicId)}
                className="sidebar-link" //is-active
              >
                {topic.Title} ({topic.MatchedCount})
              </li>
            ))}
          </div>
        </div>
      </div>
      {/* sidebar */}
      {/* wrapper */}
      <div className="wrapper">
        <div className="header">
          <div className="search-bar">
            <input type="text" placeholder="başlık, #entry, @yazar"></input>
          </div>
          <div className="user-settings">
            <div
              className="icons"
              onClick={() => changeTheme()}
              title={
                "Switch Theme to: " + (theme === "light" ? "Dark" : "Light")
              }
            >
              <IconsTheme theme={theme} />
            </div>
            <div className="icons deactive" title="Notification Sound">
              <IconsSound />
            </div>
            <div className="icons deactive" title="Push Notification">
              <IconsNotify />
            </div>
            <div className="icons" title="Github">
              <a
                href="https://github.com/agmmnn/eksiflow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SvgGithub />
              </a>
            </div>
          </div>
        </div>
        <FlowContent
          pageidx={topicid ? topicid : data?.Data.Topics[0].TopicId}
        />
      </div>
    </>
  );
};

/* Icons */
const IconsTheme = ({ theme }) => {
  if (theme === "light") {
    return (
      <svg viewBox="0 0 30 30" fill="currentColor">
        <path d="M22,21c-6.627,0-12-5.373-12-12c0-1.95,0.475-3.785,1.3-5.412C6.485,5.148,3,9.665,3,15c0,6.627,5.373,12,12,12 c4.678,0,8.72-2.682,10.7-6.588C24.534,20.79,23.292,21,22,21z"></path>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 22 22" height="20" fill="currentColor">
      <path d="M12 2L9 5L5 5L5 9L2 12L5 15L5 19L9 19L12 22L15 19L19 19L19 15L22 12L19 9L19 5L15 5L12 2 z M 12 7C14.761 7 17 9.239 17 12C17 14.761 14.761 17 12 17C9.239 17 7 14.761 7 12C7 9.239 9.239 7 12 7 z" />
    </svg>
  );
};
const IconsSound = () => (
  <svg viewBox="0 0 32 32" fill="currentColor">
    <path
      className="puchipuchi_een"
      d="M16,6v20c0,1.1-0.772,1.537-1.715,0.971l-6.57-3.942C6.772,22.463,5.1,22,4,22H3c-1.1,0-2-0.9-2-2
v-8c0-1.1,0.9-2,2-2h1c1.1,0,2.772-0.463,3.715-1.029l6.57-3.942C15.228,4.463,16,4.9,16,6z M26.606,5.394
c-0.781-0.781-2.047-0.781-2.828,0s-0.781,2.047,0,2.828C25.855,10.3,27,13.062,27,16s-1.145,5.7-3.222,7.778
c-0.781,0.781-0.781,2.047,0,2.828c0.391,0.391,0.902,0.586,1.414,0.586s1.023-0.195,1.414-0.586C29.439,23.773,31,20.007,31,16
S29.439,8.227,26.606,5.394z M22.363,9.636c-0.781-0.781-2.047-0.781-2.828,0s-0.781,2.047,0,2.828C20.479,13.409,21,14.664,21,16
s-0.52,2.591-1.464,3.535c-0.781,0.781-0.781,2.047,0,2.828c0.391,0.391,0.902,0.586,1.414,0.586s1.023-0.195,1.414-0.586
C24.064,20.664,25,18.404,25,16S24.063,11.336,22.363,9.636z"
    ></path>
  </svg>
);
const IconsNotify = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z"
    ></path>
  </svg>
);

const SvgGithub = () => (
  <svg viewBox="0 0 28 28" fill="currentColor">
    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
  </svg>
);

/* Post Body */
const post_body = {
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
