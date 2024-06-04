import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./Pagination.scss";

type PaginationProps = {
  currentPage: number;
  totalPage: number;
  mode: "button-only" | "full";
  onPageChange: (page: number) => void;
};

function Pagination({
  mode,
  currentPage,
  totalPage,
  onPageChange,
}: PaginationProps) {
  const handleNextPage = () => {
    onPageChange(currentPage === totalPage ? totalPage : currentPage + 1);
    onPageChange(currentPage + 1);
  };

  const handlePrevPage = () => {
    onPageChange(currentPage === 1 ? 1 : currentPage - 1);
    onPageChange(currentPage - 1);
  };

  return (
    <>
      <div className="pagination-container">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        {mode === "full" &&
          Array.from({ length: totalPage }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => {
                onPageChange(index + 1);
              }}
              className="active"
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </button>
          ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPage}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </>
  );
}

export default Pagination;
