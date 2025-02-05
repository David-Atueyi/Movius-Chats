import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import { CheckAllIcon } from '../../assets/Icons/CheckAllIcon';
import { CheckIcon } from '../../assets/Icons/CheckIcon';
import { useChatContext } from '../../context/ChatContext';
const MessageStatus = ({
  time,
  status,
  isCurrentUser,
  hasText,
  hasAudio
}) => {
  const {
    theme,
    showMessageStatus
  } = useChatContext();
  return /*#__PURE__*/React.createElement(React.Fragment, null, showMessageStatus && /*#__PURE__*/React.createElement(View, {
    style: [tw`flex-row items-center`, hasText ? tw`justify-end pb-1 ml-4` : hasAudio ? tw`absolute right-3 bottom-3` : tw`absolute right-3 bottom-4 bg-black/50 px-2 py-1 rounded-md`]
  }, /*#__PURE__*/React.createElement(Text, {
    style: [tw`text-xs`, {
      color: hasText || hasAudio ? theme?.colors?.timestamp || 'rgba(107, 114, 128, 0.7)' : 'white'
    }]
  }, time), isCurrentUser && /*#__PURE__*/React.createElement(View, {
    style: tw`ml-1 flex-row items-center`
  }, status === 'sent' && /*#__PURE__*/React.createElement(CheckIcon, {
    style: tw.style('fill-gray-500/70 h-4 w-4')
  }), status === 'delivered' && /*#__PURE__*/React.createElement(CheckAllIcon, {
    style: tw.style('fill-gray-500/70 h-4 w-4')
  }), status === 'read' && /*#__PURE__*/React.createElement(CheckAllIcon, {
    style: tw.style('fill-blue-500/90 h-4 w-4')
  }))));
};
export default /*#__PURE__*/React.memo(MessageStatus);
//# sourceMappingURL=MessageStatus.js.map