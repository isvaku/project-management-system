import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { FaList } from "react-icons/fa";
import { GET_PROJECTS } from "../queries/projectQueries";
import { GET_CLIENTS } from "../queries/clientQueries";
import { ADD_PROJECT } from "../mutations/projectMutation";

export default function AddProjectModal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("new");

  const { loading, error, data } = useQuery(GET_CLIENTS);

  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { name, description, clientId, status },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({ query: GET_PROJECTS });

      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...projects, addProject] },
      });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === "" || description === "" || status === "" || clientId === "") {
      return alert("Please fill in all fields");
    }

    addProject(name, description, status, clientId);

    setName("");
    setDescription("");
    setStatus("new");
    setClientId("");
  };

  if (loading) return null;
  if (error) return "Something went worng";

  return (
    <>
      {!loading && !error && (
        <>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addProjectModal"
          >
            <div className="d-flex align-items-center">
              <FaList className="icon" />
              <div>Add Project</div>
            </div>
          </button>

          <div
            className="modal fade"
            id="addProjectModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="addProjectModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addProjectModalLabel">
                    Add Project
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form action="" onSubmit={onSubmit}>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Description
                      </label>
                      <textarea
                        type="description"
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-3 form-floating">
                      <select
                        type="status"
                        className="form-select"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="new">Not Started</option>
                        <option value="progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <label htmlFor="status">Status</label>
                    </div>
                    <div className="mb-3 form-floating">
                      <select
                        type="clientId"
                        className="form-select"
                        id="clientId"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                      >
                        <option value="">Select client</option>
                        {data.clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="status">Status</label>
                    </div>
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="btn btn-secondary"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
