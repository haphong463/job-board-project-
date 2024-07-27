import { motion } from "framer-motion";

export function BlogPagination(props) {
  return (
    <div className="row pagination-wrap mt-5">
      <div className="col-md-12 text-center ">
        <div className="custom-pagination ml-auto">
          <motion.a
            className={`prev ${props.currentPage === 0 ? "disabled" : ""}`}
            onClick={() => props.paginate(props.currentPage - 1)}
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.9,
            }}
          >
            Prev
          </motion.a>
          <div className="d-inline-block">
            {Array.from(
              {
                length: props.totalPages,
              },
              (_, i) => (
                <motion.a
                  key={i}
                  className={`${props.currentPage === i ? "active" : ""}`}
                  onClick={() => props.paginate(i)}
                  whileHover={{
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  {i + 1}
                </motion.a>
              )
            )}
          </div>
          <motion.a
            className={`next ${
              props.currentPage === props.totalPages - 1 ? "disabled" : ""
            }`}
            onClick={() => props.paginate(props.currentPage + 1)}
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.9,
            }}
          >
            Next
          </motion.a>
        </div>
      </div>
    </div>
  );
}
