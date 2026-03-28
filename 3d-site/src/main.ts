import { Application } from "./Application/Application";

const app = new Application();
(window as any).__pauseRender  = () => app.pauseRender();
(window as any).__resumeRender = () => app.resumeRender();
