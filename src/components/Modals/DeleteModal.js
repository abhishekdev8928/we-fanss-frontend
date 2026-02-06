import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner
} from "reactstrap";

const DeleteConfirmModal = ({
  isOpen,
  toggle,                // function to close modal
  onConfirm,              // function when delete is confirmed
  title = "Delete Item",  // heading text
  message = "This action cannot be undone.", // description text
  cancelText = "Cancel",
  confirmText = "Delete",
  confirmColor = "danger", // Bootstrap color: danger, primary, etc
  cancelColor = "light",
  loading = false,        // show spinner on delete button
  centered = true
}) => {
  return (
    <Modal
      isOpen={isOpen}

      toggle={toggle}
      centered={centered}
      contentClassName="border-0 rounded-4 p-3"
    >
       

    <ModalHeader
  toggle={toggle}
  className="border-0 pb-0 position-relative"
>
  <div className="w-100 text-start ">
    <h2 className="fw-medium fs-5 lh-sm mb-2">{title}</h2>
    <p className="fw-normal fs-6 lh-sm  text-muted mb-0">{message}</p>
  </div>
</ModalHeader>

      <ModalBody className="pt-4">
        <ModalFooter className="border-0 d-flex justify-content-between gap-4 p-0">
         <button
  color={cancelColor}
  onClick={toggle}
  disabled={loading}
  style={{
    flex:"1",
    width:"100%",
    height: "48px",
    backgroundColor: "#F5F5F5",
    borderRadius: "8px",
    
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    opacity: 1
  }}
>
  {cancelText}
</button>


          <button
  
  onClick={onConfirm}
  disabled={loading}
  style={{
    flex:"1",
    width:"100%",
    height: "48px",
    backgroundColor: "#BA2526",
    borderRadius: "8px",
   
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    opacity: 1,
    border: "none",
    color: "#ffffff"
  }}
>
  {loading ? (
    <>
      <Spinner size="sm" />
      Processing...
    </>
  ) : (
    confirmText
  )}
</button>

        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default DeleteConfirmModal;
