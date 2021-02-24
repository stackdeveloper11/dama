using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Optimization;

namespace akset.App_Start
{
    public static class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/content/all").Include(
              "~/content/bootstrap.min.css",
              "~/content/font-awesome.min.css",
              "~/content/site.css"
           ));
            bundles.Add(new ScriptBundle("~/scripts/all").Include(
               "~/js/jquery-2.2.4.min.js",
               "~/Scripts/bootstrap.bundle.min.js"
         
            ));
            bundles.Add(new StyleBundle("~/content/smartadmin").IncludeDirectory("~/Areas/Admin/content/css", "*.min.css"));
            bundles.Add(new ScriptBundle("~/scripts/smartadmin").Include(
                "~/Areas/Admin/scripts/app.config.js",
                "~/Areas/Admin/scripts/plugin/jquery-touch/jquery.ui.touch-punch.min.js",
                "~/Areas/Admin/scripts/bootstrap/bootstrap.min.js",
                "~/Areas/Admin/scripts/notification/SmartNotification.min.js",
                "~/Areas/Admin/scripts/smartwidgets/jarvis.widget.min.js",
                "~/Areas/Admin/scripts/plugin/jquery-validate/jquery.validate.min.js",
                "~/Areas/Admin/scripts/plugin/masked-input/jquery.maskedinput.min.js",
         
                "~/Areas/Admin/scripts/plugin/bootstrap-slider/bootstrap-slider.min.js",
                "~/Areas/Admin/scripts/plugin/bootstrap-progressbar/bootstrap-progressbar.min.js",
                "~/Areas/Admin/scripts/plugin/msie-fix/jquery.mb.browser.min.js",
                "~/Areas/Admin/scripts/plugin/fastclick/fastclick.min.js",
                "~/Areas/Admin/scripts/app.min.js"));
            bundles.Add(new ScriptBundle("~/scripts/full-calendar").Include(
                "~/Areas/Admin/scripts/plugin/moment/moment.min.js",
                "~/Areas/Admin/scripts/plugin/fullcalendar/jquery.fullcalendar.min.js"
                ));
            bundles.Add(new ScriptBundle("~/scripts/charts").Include(
                "~/Areas/Admin/scripts/plugin/easy-pie-chart/jquery.easy-pie-chart.min.js",
                "~/Areas/Admin/scripts/plugin/sparkline/jquery.sparkline.min.js",
                "~/Areas/Admin/scripts/plugin/morris/morris.min.js",
                "~/Areas/Admin/scripts/plugin/morris/raphael.min.js",
                "~/Areas/Admin/scripts/plugin/flot/jquery.flot.cust.min.js",
                "~/Areas/Admin/scripts/plugin/flot/jquery.flot.resize.min.js",
                "~/Areas/Admin/scripts/plugin/flot/jquery.flot.time.min.js",
                "~/Areas/Admin/scripts/plugin/flot/jquery.flot.fillbetween.min.js",
                "~/Areas/Admin/scripts/plugin/flot/jquery.flot.orderBar.min.js",
                "~/Areas/Admin/scripts/plugin/flot/jquery.flot.pie.min.js",
                "~/Areas/Admin/scripts/plugin/flot/jquery.flot.tooltip.min.js",
                "~/Areas/Admin/scripts/plugin/dygraphs/dygraph-combined.min.js",
                "~/Areas/Admin/scripts/plugin/chartjs/chart.min.js",
                "~/Areas/Admin/scripts/plugin/highChartCore/highcharts-custom.min.js",
                "~/Areas/Admin/scripts/plugin/highchartTable/jquery.highchartTable.min.js"
                ));
            bundles.Add(new ScriptBundle("~/scripts/datatables").Include(
                "~/Areas/Admin/scripts/plugin/datatables/jquery.dataTables.min.js",
                "~/Areas/Admin/scripts/plugin/datatables/dataTables.colVis.min.js",
                "~/Areas/Admin/scripts/plugin/datatables/dataTables.tableTools.min.js",
                "~/Areas/Admin/scripts/plugin/datatables/dataTables.bootstrap.min.js",
                "~/Areas/Admin/scripts/plugin/datatable-responsive/datatables.responsive.min.js"
                ));
            bundles.Add(new ScriptBundle("~/scripts/jq-grid").Include(
                "~/Areas/Admin/scripts/plugin/jqgrid/jquery.jqGrid.min.js",
                "~/Areas/Admin/scripts/plugin/jqgrid/grid.locale-en.min.js"
                ));
            bundles.Add(new ScriptBundle("~/scripts/forms").Include(
                "~/Areas/Admin/scripts/plugin/jquery-form/jquery-form.min.js"
                ));

            bundles.Add(new ScriptBundle("~/scripts/smart-chat").Include(
                "~/Areas/Admin/scripts/smart-chat-ui/smart.chat.ui.min.js",
                "~/Areas/Admin/scripts/smart-chat-ui/smart.chat.manager.min.js"
                ));

            bundles.Add(new ScriptBundle("~/scripts/vector-map").Include(
                "~/Areas/Admin/scripts/plugin/vectormap/jquery-jvectormap-1.2.2.min.js",
                "~/Areas/Admin/scripts/plugin/vectormap/jquery-jvectormap-world-mill-en.js"
                ));

            BundleTable.EnableOptimizations = true;
        }
    }
}
