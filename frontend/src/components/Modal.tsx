import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    // Prevent scrolling on the body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
                        <X size={24} />
                    </button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
