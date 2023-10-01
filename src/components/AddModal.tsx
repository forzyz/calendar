import React from "react";

interface AddModalProps {
  handleTitleChange: (event: { target: { value: string }; }) => void;
  title: string;
}

const AddModal: React.FC<AddModalProps> = ({handleTitleChange, title}) =>  {
  return (
    <div
      className="modal fade"
      id="event-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">Modal title</h4>
          </div>
          <div className="modal-body">
            <form name="save-event" method="post">
              <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={handleTitleChange} type="text" name="title" className="form-control"  />
              </div>
              <div className="form-group">
                <label>Event start</label>
                <input
                  type="text"
                  name="evtStart"
                  className="form-control col-xs-3"
                />
              </div>
              <div className="form-group">
                <label>Event end</label>
                <input
                  type="text"
                  name="evtEnd"
                  className="form-control col-xs-3"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
