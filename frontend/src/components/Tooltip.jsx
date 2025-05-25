import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 100,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  let timeout;

  const show = () => {
    timeout = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className={clsx(
              'absolute z-50 px-3 py-1.5 text-sm rounded shadow-md bg-gray-800 text-white whitespace-nowrap dark:bg-gray-700',
              positions[position],
              className
            )}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
