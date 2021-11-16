/* eslint-disable react/style-prop-object */
import React from 'react'

export default function EyeIcon({
  fill = "#c6d3e7",
  width = 16,
  height = 16,
  className = "",
  styles = {},
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 512.001 512.001"
      width={width}
      height={height}
      className={className}
      style={{ ...styles }}
      fill={fill}
    >
      <path d="M509.156,247.212c-15.945-22.055-43.064-52.304-76.151-80.07C382.54,124.789,321.902,91,256.001,91    c-66.923,0-129.421,35.217-179.977,78.619c-44.516,38.216-72.029,76.003-73.179,77.593c-3.793,5.246-3.793,12.332,0,17.577    c13.812,19.104,37.568,46.76,68.154,73.51C119.589,380.793,185.417,421,256.001,421c63.631,0,121.749-31.323,171-71.235    c33.782-27.376,63.233-58.803,82.155-84.976C512.949,259.543,512.949,252.457,509.156,247.212z M410.001,324.977    c-41,33.888-95.344,66.023-154,66.023c-59.018,0-117.852-33.548-165.999-76.139c-20.999-18.576-39.965-38.872-56.026-58.855    c9.862-12.252,29.923-35.656,57.025-59.582C133.01,159.338,191.933,121,256.001,121c55.788,0,111.412,29.976,158,69.232    c24.193,20.385,45.949,43.272,64.025,65.763C466.873,269.851,442.674,297.971,410.001,324.977z" />
      <path d="M256.001,151c-57.897,0-105,47.103-105,105c0,57.897,47.103,105,105,105c57.897,0,105-47.103,105-105    C361.001,198.103,313.898,151,256.001,151z M256.001,331c-41.355,0-75-33.645-75-75c0-41.355,33.645-75,75-75s75,33.645,75,75    S297.356,331,256.001,331z" />
      <path d="M256.001,211c-24.813,0-45,20.187-45,45s20.187,45,45,45s45-20.187,45-45S280.814,211,256.001,211z M256.001,271    c-8.271,0-15-6.729-15-15s6.729-15,15-15s15,6.729,15,15S264.272,271,256.001,271z" />
    </svg>
  );
}
