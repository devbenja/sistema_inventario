export function Alert({ type, message }) {
  const alertTypeClass = type === "success" ? "bg-green-100" : "bg-red-100";
  const alertTextColor = type === "success" ? "text-green-700" : "text-red-700";
  return (
    <div
      // className={`mt-5 flex ${alertTypeClass} rounded-lg p-2 mb-7 text-sm ${alertTextColor} w-1/2 justify-center `}
      // role="alert"
      className={`mt-5 flex ${alertTypeClass} rounded-lg p-2 mb-7 text-sm ${alertTextColor} w-1/2 justify-center items-center`}
      role="alert"
    >
      {type === "success" ? (
        <svg
          className="fill-current h-6 w-6 mt-1 mr-2 text-green-600"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 10.293a1 1 0 0 1 1.414 0L10 12.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z"
          />
        </svg>
      ) : (
        <svg
          className="fill-current h-6 w-6 mt-1 mr-2 text-red-600"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 1a9 9 0 1 0 0 18A9 9 0 0 0 10 1zm1 13a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v6zM9 7a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0V7z"
          />
        </svg>
      )}
      <span className="sm:inline block mt-1">{message}</span>
    </div>
  );
}
