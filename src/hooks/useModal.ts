import { useState } from 'react';

export function useModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const openModal = (title?: string, message?: string) => {
    setIsVisible(true);
    setTitle(title || '');
    setMessage(message || '');
  };
  const closeModal = () => setIsVisible(false);

  return { isVisible, openModal, closeModal, title, message };
}
