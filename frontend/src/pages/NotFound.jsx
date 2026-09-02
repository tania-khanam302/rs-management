import "./../NotFound.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>

        <h2>Not Found</h2>

        <p>The resource requested could not be found on this server!</p>
      </div>

      <footer className="not-found-footer">
        <p>Proudly powered by LiteSpeed Web Server</p>

        <p>
          Please be advised that LiteSpeed Technologies Inc. is not a web
          hosting company and, as such, has no control over content found on
          this site.
        </p>
      </footer>
    </div>
  );
}

export default NotFound;
