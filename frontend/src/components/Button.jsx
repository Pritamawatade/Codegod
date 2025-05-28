
function Button({ onClick, buttonText, Icon }) {
  return (
    <button
      onClick={() => onClick()}
      className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform cursor-pointer shadow-lg hover:shadow-xl flex items-center gap-2"
    >
      {<Icon className="w-4 h-4" />}
      {buttonText}
    </button>
  );
}

export default Button;
