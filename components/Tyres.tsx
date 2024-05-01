import React from "react";

export const getCompoundComponent = (compoundText: string) => {
  switch (compoundText) {
      case "SOFT":
          return <SoftCompound />;
      case "MEDIUM":
          return <MediumCompound />;
      case "HARD":
          return <HardCompound />;
      case "INTERMEDIATE":
          return <InterCompound />;
      case "WET":
          return <WetCompound />;
      case "UNKNOWN":
          return "U";
      case "TEST_UNKNOWN":
          return "T";
      default:
          return null;
  }
};

export const SoftCompound: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      version="1.1"
      viewBox="0 0 100 100"
    >
      <defs>
        <path d="M129.079 24.568H174.058V82.209H129.079z"></path>
        <path d="M106.778 41.388H174.436V99.97399999999999H106.778z"></path>
        <path d="M117.929 39.688H155.916V78.809H117.929z"></path>
      </defs>
      <g>
        <circle
          cx="50"
          cy="50"
          r="50"
          fill="#000"
          fillRule="evenodd"
          strokeWidth="0.265"
        ></circle>
        <path
          fill="red"
          strokeWidth="0.746"
          d="M151.182 32.855A160.63 160.63 0 0028.346 188.977a160.63 160.63 0 00122.836 156.12V299.88A117.165 117.165 0 0171.81 188.977a117.165 117.165 0 0179.37-110.903zm75.59 0v45.22a117.165 117.165 0 0179.37 110.902 117.165 117.165 0 01-79.37 110.902v45.219a160.63 160.63 0 00122.833-156.121A160.63 160.63 0 00226.771 32.855z"
          transform="scale(.26458)"
        ></path>
        <text
          x="141.174"
          y="63.311"
          strokeWidth="0.265"
          fontFamily="Formula1"
          fontSize="10.583"
          style={{ lineHeight: "1.25" }}
        ></text>
        <g
          fill="#fff"
          strokeWidth="0.265"
          aria-label="S"
          fontFamily="Formula1"
          fontSize="66.928"
          fontStretch="normal"
          fontStyle="normal"
          fontWeight="500"
          transform="matrix(.72225 0 0 .72706 -84.575 27.411)"
          fontVariant="normal"
          style={{ lineHeight: "0", whiteSpace: "pre" }}
        >
          <path d="M189.875 37.835l-12.047-3.548q-6.96-2.074-10.307-5.688-3.346-3.614-3.346-8.634 0-6.291 4.417-9.972 4.417-3.681 12.448-3.681h25.767v11.043h-25.834q-2.141 0-3.011.803-.87.736-.87 1.673 0 1.205.803 2.008.87.736 2.744 1.272l12.247 3.547q7.764 2.275 11.646 5.622 3.949 3.28 3.949 9.236 0 3.078-1.205 5.822-1.138 2.744-3.547 4.752-2.343 2.008-6.024 3.213-3.614 1.204-8.5 1.204h-23.692V45.464h25.7q2.543 0 3.547-1.004 1.004-1.003 1.004-2.342 0-1.606-1.271-2.41-1.205-.87-4.618-1.873z"></path>
        </g>
      </g>
    </svg>
  );
};

export const MediumCompound: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      version="1.1"
      viewBox="0 0 100 100"
    >
      <defs>
        <path d="M129.079 24.568H174.058V82.209H129.079z"></path>
        <path d="M106.778 41.388H174.436V99.97399999999999H106.778z"></path>
        <path d="M117.929 39.688H155.916V78.809H117.929z"></path>
      </defs>
      <g>
        <circle
          cx="50"
          cy="50"
          r="50"
          fill="#000"
          fillRule="evenodd"
          strokeWidth="0.265"
        ></circle>
        <path
          fill="#ff0"
          strokeWidth="0.746"
          d="M151.182 32.855A160.63 160.63 0 0028.346 188.977a160.63 160.63 0 00122.836 156.12V299.88A117.165 117.165 0 0171.81 188.977a117.165 117.165 0 0179.37-110.903zm75.59 0v45.22a117.165 117.165 0 0179.37 110.902 117.165 117.165 0 01-79.37 110.902v45.219a160.63 160.63 0 00122.833-156.121A160.63 160.63 0 00226.771 32.855z"
          transform="scale(.26458)"
        ></path>
        <text
          x="141.174"
          y="63.311"
          strokeWidth="0.265"
          fontFamily="Formula1"
          fontSize="10.583"
          style={{ lineHeight: "1.25" }}
        ></text>
        <g
          fill="#fff"
          strokeWidth="0.265"
          aria-label="M"
          fontFamily="Formula1"
          fontSize="66.928"
          fontStretch="normal"
          fontStyle="normal"
          fontWeight="500"
          transform="matrix(.55339 0 0 .55708 -60.482 30.931)"
          fontVariant="normal"
          style={{ lineHeight: "0", whiteSpace: "pre" }}
        >
          <path d="M163.505 56.507l3.146-35.873q.67-8.031 4.35-11.578 3.748-3.547 9.437-3.547 6.09 0 9.637 3.748 3.615 3.68 4.618 10.106l3.95 24.964q.133.803.4 1.204.335.402 1.005.402.669 0 1.004-.469.334-.468.401-1.271l3.815-24.897q.937-6.358 4.484-10.04 3.614-3.747 9.638-3.747 6.358 0 9.437 3.614 3.145 3.547 3.814 11.511l3.146 35.873H222.87l-2.677-37.814q-.067-.669-.268-1.137-.134-.469-.803-.469-.535 0-.87.469-.335.401-.402 1.003l-4.484 26.838q-.87 5.355-4.35 8.634-3.413 3.28-9.035 3.28-5.823 0-9.303-3.347-3.48-3.413-4.35-8.633l-4.685-26.705q-.134-.736-.469-1.137-.335-.402-.87-.402-.67 0-.937.469-.2.468-.268 1.204l-2.677 37.747z"></path>
        </g>
      </g>
    </svg>
  );
};

export const HardCompound: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="100%"
      viewBox="0 0 100 100"
    >
      <defs>
        <path d="M129.079 24.568H174.058V82.209H129.079z"></path>
        <path d="M106.778 41.388H174.436V99.97399999999999H106.778z"></path>
        <path d="M117.929 39.688H155.916V78.809H117.929z"></path>
      </defs>
      <g>
        <circle
          cx="50"
          cy="50"
          r="50"
          fill="#000"
          fillRule="evenodd"
          strokeWidth="0.265"
        ></circle>
        <path
          fill="#fff"
          strokeWidth="0.746"
          d="M151.182 32.855A160.63 160.63 0 0028.346 188.977a160.63 160.63 0 00122.836 156.12V299.88A117.165 117.165 0 0171.81 188.977a117.165 117.165 0 0179.37-110.903zm75.59 0v45.22a117.165 117.165 0 0179.37 110.902 117.165 117.165 0 01-79.37 110.902v45.219a160.63 160.63 0 00122.833-156.121A160.63 160.63 0 00226.771 32.855z"
          transform="scale(.26458)"
        ></path>
        <text
          x="141.174"
          y="63.311"
          strokeWidth="0.265"
          fontFamily="Formula1"
          fontSize="10.583"
          style={{ lineHeight: "1.25" }}
        ></text>
        <g
          fill="#fff"
          strokeWidth="0.265"
          aria-label="H"
          fontFamily="Formula1"
          fontSize="66.928"
          fontStretch="normal"
          fontStyle="normal"
          fontWeight="500"
          transform="matrix(.71244 0 0 .7172 -85.68 27.473)"
          fontVariant="normal"
          style={{ lineHeight: "0", whiteSpace: "pre" }}
        >
          <path
            d="M165.178 56.507V6.312h13.386v19.007h23.76V6.312h13.385v50.195h-13.386V37.032h-23.76v19.475z"
            fill="#fff"
            strokeWidth="0.265"
            fontFamily="Formula1"
            fontSize="66.928"
            fontStretch="normal"
            fontStyle="normal"
            fontVariant="normal"
            fontWeight="500"
            style={{ lineHeight: "1.65" }}
          ></path>
        </g>
      </g>
    </svg>
  );
};

export const InterCompound: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      version="1.1"
      viewBox="0 0 100 100"
    >
      <defs>
        <path d="M129.079 24.568H174.058V82.209H129.079z"></path>
        <path d="M106.778 41.388H174.436V99.97399999999999H106.778z"></path>
        <path d="M117.929 39.688H155.916V78.809H117.929z"></path>
      </defs>
      <g>
        <circle
          cx="50"
          cy="50"
          r="50"
          fill="#000"
          fillRule="evenodd"
          strokeWidth="0.265"
        ></circle>
        <path
          fill="#0a0"
          strokeWidth="0.746"
          d="M151.182 32.855A160.63 160.63 0 0028.346 188.977a160.63 160.63 0 00122.836 156.12V299.88A117.165 117.165 0 0171.81 188.977a117.165 117.165 0 0179.37-110.903zm75.59 0v45.22a117.165 117.165 0 0179.37 110.902 117.165 117.165 0 01-79.37 110.902v45.219a160.63 160.63 0 00122.833-156.121A160.63 160.63 0 00226.771 32.855z"
          transform="scale(.26458)"
        ></path>
        <text
          x="141.174"
          y="63.311"
          strokeWidth="0.265"
          fontFamily="Formula1"
          fontSize="10.583"
          style={{ lineHeight: "1.25" }}
        ></text>
        <g
          fill="#0f0"
          strokeWidth="0.265"
          aria-label="I"
          fontFamily="Formula1"
          fontSize="66.928"
          fontStretch="normal"
          fontStyle="normal"
          fontWeight="500"
          transform="matrix(.74708 0 0 .7172 -78.65 27.473)"
          fontVariant="normal"
          style={{ lineHeight: "0", whiteSpace: "pre" }}
        >
          <path fill="#fff" d="M165.513 56.507V6.312H178.9v50.195z"></path>
        </g>
      </g>
    </svg>
  );
};

export const WetCompound: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      version="1.1"
      viewBox="0 0 100 100"
    >
      <defs>
        <path d="M129.079 24.568H174.058V82.209H129.079z"></path>
        <path d="M106.778 41.388H174.436V99.97399999999999H106.778z"></path>
        <path d="M117.929 39.688H155.916V78.809H117.929z"></path>
      </defs>
      <g>
        <circle
          cx="50"
          cy="50"
          r="50"
          fill="#000"
          fillRule="evenodd"
          strokeWidth="0.265"
        ></circle>
        <path
          fill="#00f"
          strokeWidth="0.746"
          d="M151.182 32.855A160.63 160.63 0 0028.346 188.977a160.63 160.63 0 00122.836 156.12V299.88A117.165 117.165 0 0171.81 188.977a117.165 117.165 0 0179.37-110.903zm75.59 0v45.22a117.165 117.165 0 0179.37 110.902 117.165 117.165 0 01-79.37 110.902v45.219a160.63 160.63 0 00122.833-156.121A160.63 160.63 0 00226.771 32.855z"
          transform="scale(.26458)"
        ></path>
        <text
          x="141.174"
          y="63.311"
          strokeWidth="0.265"
          fontFamily="Formula1"
          fontSize="10.583"
          style={{ lineHeight: "1.25" }}
        ></text>
        <g
          fill="#fff"
          strokeWidth="0.265"
          aria-label="w"
          fontFamily="Formula1"
          fontSize="66.928"
          fontStretch="normal"
          fontStyle="normal"
          fontWeight="500"
          transform="matrix(.6465 0 0 .65082 -77.126 28.5)"
          fontVariant="normal"
          style={{ lineHeight: "0", whiteSpace: "pre" }}
        >
          <path d="M196.701 15.48q3.213 0 5.488.938 2.276.937 3.815 2.476 1.54 1.473 2.343 3.48.87 2.008 1.204 4.15l2.945 19.208q.067.67.402 1.138.334.468.937.468.602 0 .87-.468.268-.469.334-1.138l5.087-29.381h11.31l-5.019 30.72q-.803 4.752-4.15 7.429-3.279 2.677-7.964 2.677-6.023 0-9.503-3.079-3.414-3.079-4.217-8.165l-2.878-18.405q-.067-.603-.334-.937-.201-.335-.804-.335-.602 0-.803.335-.2.334-.267 1.004L193.087 46q-.67 5.02-3.949 8.098-3.279 3.079-8.566 3.079-5.087 0-8.433-2.544-3.346-2.543-4.35-7.696l-5.957-30.586h12.114l5.354 29.314q.134.87.402 1.272.334.401.87.401.602 0 .87-.401.334-.469.401-1.205l2.677-19.342q.268-2.075 1.138-4.016.87-1.94 2.343-3.48 1.472-1.54 3.614-2.476 2.208-.937 5.086-.937z"></path>
        </g>
      </g>
    </svg>
  );
};

export const TyreCompound: React.FC<{ compound: string }> = ({ compound }) => {
  let path: string;
  let color: string;
  let label: string;

  switch (compound) {
    case "SOFT":
      path = "M189.875 37.835l-12.047-3.548q-6.96-2.074-10.307-5.688-3.346-3.614-3.346-8.634 0-6.291 4.417-9.972 4.417-3.681 12.448-3.681h25.767v11.043h-25.834q-2.141 0-3.011.803-.87.736-.87 1.673 0 1.205.803 2.008.87.736 2.744 1.272l12.247 3.547q7.764 2.275 11.646 5.622 3.949 3.28 3.949 9.236 0 3.078-1.205 5.822-1.138 2.744-3.547 4.752-2.343 2.008-6.024 3.213-3.614 1.204-8.5 1.204h-23.692V45.464h25.7q2.543 0 3.547-1.004 1.004-1.003 1.004-2.342 0-1.606-1.271-2.41-1.205-.87-4.618-1.873z";
      color = '#a00';
      label = 'S';
    case "MEDIUM":
      path = "M165.178 56.507V6.312h13.386v19.007h23.76V6.312h13.385v50.195h-13.386V37.032h-23.76v19.475z";
      color = '#ff0';
      label = 'M';
    case "HARD":
        path = "M151.182 32.855A160.63 160.63 0 0028.346 188.977a160.63 160.63 0 00122.836 156.12V299.88A117.165 117.165 0 0171.81 188.977a117.165 117.165 0 0179.37-110.903zm75.59 0v45.22a117.165 117.165 0 0179.37 110.902 117.165 117.165 0 01-79.37 110.902v45.219a160.63 160.63 0 00122.833-156.121A160.63 160.63 0 00226.771 32.855z";
        color = '#fff';
        label = 'H';
    case "INTERMEDIATE":
      path = "M165.513 56.507V6.312H178.9v50.195z";
      color = '#0a0';
      label = 'I';
    case "WET":
      path = "M196.701 15.48q3.213 0 5.488.938 2.276.937 3.815 2.476 1.54 1.473 2.343 3.48.87 2.008 1.204 4.15l2.945 19.208q.067.67.402 1.138.334.468.937.468.602 0 .87-.468.268-.469.334-1.138l5.087-29.381h11.31l-5.019 30.72q-.803 4.752-4.15 7.429-3.279 2.677-7.964 2.677-6.023 0-9.503-3.079-3.414-3.079-4.217-8.165l-2.878-18.405q-.067-.603-.334-.937-.201-.335-.804-.335-.602 0-.803.335-.2.334-.267 1.004L193.087 46q-.67 5.02-3.949 8.098-3.279 3.079-8.566 3.079-5.087 0-8.433-2.544-3.346-2.543-4.35-7.696l-5.957-30.586h12.114l5.354 29.314q.134.87.402 1.272.334.401.87.401.602 0 .87-.401.334-.469.401-1.205l2.677-19.342q.268-2.075 1.138-4.016.87-1.94 2.343-3.48 1.472-1.54 3.614-2.476 2.208-.937 5.086-.937z";
      color = '#00a';
      label = 'W';
    /*case "UNKNOWN":
      path = ;
      color = 'black';
      label = 'U';
    case "TEST_UNKNOWN":
      path = ;
      color = 'white';
      label = 'T';*/
    default:
        path = '';
        color ='';
        label ='';
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      version="1.1"
      viewBox="0 0 100 100"
    >
      <defs>
        <path d="M129.079 24.568H174.058V82.209H129.079z"></path>
        <path d="M106.778 41.388H174.436V99.97399999999999H106.778z"></path>
        <path d="M117.929 39.688H155.916V78.809H117.929z"></path>
      </defs>
      <g>
        <circle
          cx="50"
          cy="50"
          r="50"
          fill="#000"
          fillRule="evenodd"
          strokeWidth="0.265"
        ></circle>
        <path
          fill={color}
          strokeWidth="0.746"
          d="M151.182 32.855A160.63 160.63 0 0028.346 188.977a160.63 160.63 0 00122.836 156.12V299.88A117.165 117.165 0 0171.81 188.977a117.165 117.165 0 0179.37-110.903zm75.59 0v45.22a117.165 117.165 0 0179.37 110.902 117.165 117.165 0 01-79.37 110.902v45.219a160.63 160.63 0 00122.833-156.121A160.63 160.63 0 00226.771 32.855z"
          transform="scale(.26458)"
        ></path>
        <text
          x="141.174"
          y="63.311"
          strokeWidth="0.265"
          fontFamily="Formula1"
          fontSize="10.583"
          style={{ lineHeight: "1.25" }}
        ></text>
        <g
          fill="#fff"
          strokeWidth="0.265"
          aria-label={label}
          fontFamily="Formula1"
          fontSize="66.928"
          fontStretch="normal"
          fontStyle="normal"
          fontWeight="500"
          transform="matrix(.72225 0 0 .72706 -84.575 27.411)"
          fontVariant="normal"
          style={{ lineHeight: "0", whiteSpace: "pre" }}
        >
          <path fill="#fff" d={path}></path>
        </g>
      </g>
    </svg>
  );
};
