import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getUserThunk } from "../../../features/userSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.list);
  const columns = [
    {
      name: "Image",
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          <img
            src={
              row.imageUrl ? row.imageUrl : "https://i.sstatic.net/l60Hf.png"
            }
            className="rounded-circle"
            width={50}
            height={50}
            alt={row.id}
          />
        </div>
      ),
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {row.username}
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {row.email}
        </div>
      ),
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {row.gender}
        </div>
      ),
    },

    // {
    //   name: "Posts",
    //   selector: (row) => row.blogCount,
    //   sortable: true,
    //   cell: (row) => <div>{row.blogCount}</div>,
    // },
    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <div className="d-flex">
    //       <button onClick={() => handleEdit(row.categoryId)} className="btn btn-info">
    //         Edit
    //       </button>
    //       {!row.blogCount > 0 && (
    //         <button
    //           onClick={() => handleDelete(row.categoryId)}
    //           className="btn btn-danger"
    //         >
    //           Delete
    //         </button>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  useEffect(() => {
    dispatch(getUserThunk());
  }, []);

  const customStyles = {
    rows: {
      style: {
        margin: "15px 0", // Adjust the margin to create spacing between rows
      },
    },
  };

  return (
    <div>
      <DataTable columns={columns} data={users} customStyles={customStyles} />
    </div>
  );
};

export default UserList;
