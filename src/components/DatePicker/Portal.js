import React, { Component } from "react";
import ReactDOM from "react-dom";

const PORTAL_ROOT_ID = "portal-root";

const getPortalRoot = () => {
  let root = document.getElementById(PORTAL_ROOT_ID);

  if (!root) {
    root = document.createElement("div");
    root.id = PORTAL_ROOT_ID;
    document.body.appendChild(root);
  }

  return root;
};

const portalRoot = getPortalRoot();

export class Portal extends Component {
  render() {
    return ReactDOM.createPortal(this.props.children, portalRoot);
  }
}
