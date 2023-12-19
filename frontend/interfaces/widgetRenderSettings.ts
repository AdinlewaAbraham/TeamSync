
export type widgetTypes = "project" | "mytask" | "privatenote"| "taskiassigned" | "_blank";
export default interface WidgetRenderSettings {
  type: widgetTypes;
  fullWidth: boolean;
}