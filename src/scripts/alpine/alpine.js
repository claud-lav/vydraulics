import Alpine from "alpinejs";
import collapse from "@alpinejs/collapse";
import { menu, share } from "./alpine-functions.js";

window.Alpine = Alpine;

Alpine.plugin(collapse);
Alpine.data("menu", menu);
Alpine.data("share", share);

Alpine.start();
