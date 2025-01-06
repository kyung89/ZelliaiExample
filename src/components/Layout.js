import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>ZelliAi Animation Sample Page</h1>
      </header>

      <div className="layout-body">
        <aside className="layout-sidebar">
          <ul>
            <li>
              <Link to="/ja_basic">JellyAnimationBasic</Link>
            </li>
            <li>
              <Link to="/ja_temp">JellyAnimationTemp</Link>
            </li>
            <li>
              <Link to="/ja_png">JellyAnimationPng</Link>
            </li>
            <li>
              <Link to="oja">OrganicJellyAnimation</Link>
            </li>
            <li>
              <Link to="/show">보여주기용 페이지</Link>
            </li>
          </ul>
        </aside>

        <main className="layout-content">
          <Outlet />
        </main>
      </div>

      <footer className="layout-footer">
        <p>© 2025 My Website. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;
