import * as React from "react";

const SvgIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.5 5" {...props}>
    <path
      fill="var(--accent)"
      fillOpacity="1"
      d="M-20.5-44a3 3 0 0 1-3-3 3 3 0 0 1 3 3m-1.168-2.624a3.2 3.2 0 0 0-1.586-.567A3 3 0 0 1-20.5-49a3 3 0 0 1-1.168 2.376"
      transform="matrix(1 0 0 -1 25 -44)"
    ></path>
    <path
      fill="var(--background)"
      d="M-25-44v-2.207l1-1V-44zm0-2.49V-49h1v1.51z"
      transform="matrix(1 0 0 -1 25 -44)"
    ></path>
  </svg>
);

export default SvgIcon;
