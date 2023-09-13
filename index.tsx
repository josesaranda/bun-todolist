import { renderToString } from "react-dom/server";

const server = Bun.serve({
  port: 1234,
  fetch: handler,
});

console.log(`Ejecutando servidor en http://${server.hostname}:${server.port}`);

const todos: string[] = [];

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/" && request.method === "GET")
    return new Response(Bun.file("index.html"));
  else if (url.pathname === "/todos" && request.method === "GET")
    return new Response(renderToString(<TodoList todos={todos}></TodoList>));
  else if (url.pathname === "/todos" && request.method === "POST") {
    const json = await request.json();
    const todo = json.todo;
    todos.unshift(todo);
    return new Response(renderToString(<TodoList todos={todos}></TodoList>));
  } else return new Response("404 not found", { status: 404 });
}

function TodoList({ todos }: { todos: string[] }) {
  return (
    <ul>
      {todos.map((todo, index) => {
        return <li key={index}>{todo}</li>;
      })}
    </ul>
  );
}
