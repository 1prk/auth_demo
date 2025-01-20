import './App.css';
import RenderOnAnonymous from "./components/RenderOnAnonymous";
import RenderOnAuthenticated from "./components/RenderOnAuthenticated";
import Public from "./components/public.jsx"
import Protected from "./components/protected.jsx"

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <RenderOnAnonymous>
          <Public/>
      </RenderOnAnonymous>

        <RenderOnAuthenticated>
            <Protected/>
        </RenderOnAuthenticated>
      </header>
    </div>
  );
}

export default App;
