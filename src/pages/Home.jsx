export default function Home() {
  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-4">Welcome to TodoApp</h1>
      <p>
        This is a simple Todo application built with <strong>React + Vite</strong> on the frontend
        and <strong>Spring Boot + H2</strong> on the backend.
      </p>
      <p>
        You can add, delete, and mark tasks as completed. The todos can be displayed in different
        ways: List Group, Cards, Table, or even a Carousel. Use the navigation menu above to
        explore all views.
      </p>
    </div>
  );
}
