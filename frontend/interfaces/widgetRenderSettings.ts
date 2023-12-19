
type widgetTypes = "project" | "mytask" | "privatenote";
export default interface WidgetRenderSettings {
  type: widgetTypes;
  fullWidth: boolean;
}