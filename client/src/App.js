import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.scss";
import Home from "./Home/Home";
import ChatRoom from "./ChatRoom/ChatRoom";
import Layout from "./Layout/Layout";

function App() {
  console.log('env???', process.env.NODE_ENV);
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/:roomId" component={ChatRoom} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
