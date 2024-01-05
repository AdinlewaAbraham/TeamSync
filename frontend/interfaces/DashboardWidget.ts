export type DashboardWidgetTypes = "number" | "line" | "doughnut" | "column";
export interface DashboardWidget {
  type: DashboardWidgetTypes;
  width: "100%" | "50%" | "25%";
}
