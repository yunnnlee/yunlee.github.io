// Load data from datasets/videogames_wide.csv using d3.csv and then make visualizations
async function fetchData() {
  const data = await d3.csv("./dataset/videogames_long.csv");
  data.forEach(d => {
    d.sales_amount = +d.sales_amount;
  });
  return data;
}


fetchData().then(async (data) => {
  const vis1_q1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 500,
    height: 300,
    data: { values: data },
    mark: { type: "bar", tooltip: true },
    encoding: {
      y: { 
        field: "genre", 
        type: "nominal", 
        sort: "-x", // descending order
        title: "Genre" 
      },
      x: { 
        field: "sales_amount", 
        type: "quantitative", 
        aggregate: "sum", 
        title: "Total Sales (Millions)" 
      },
      // the content when hovering
      tooltip: [
        { field: "genre", type: "nominal", title: "Genre" },
        { field: "sales_amount", aggregate: "sum", type: "quantitative", format: ".2f", title: "Total Sales (M)" }
      ]
    }
  };

  // Visualization 1-2
  const vis1_q2 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 500,
    height: 300,
    data: { values: data },
    mark: { type: "bar", tooltip: true },
    encoding: {
      x: { field: "genre", type: "nominal", title: "Genre" },
      y: { field: "sales_amount", type: "quantitative", aggregate: "sum", title: "Total Sales" },
      color: { 
        field: "platform", 
        type: "nominal",
        sort: { op: "sum", field: "sales_amount", order: "descending" }
      },
      // the largest one comes first
      order: { field: "sales_amount", aggregate: "sum", type: "quantitative", sort: "descending" },
      tooltip: [
        { field: "genre", type: "nominal" },
        { field: "platform", type: "nominal" },
        { field: "sales_amount", aggregate: "sum", type: "quantitative", format: ".2f" }
      ]
    }
  };

  // Visualization 2-1
  const vis2_q1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 500,
    height: 300,
    data: { values: data },
    // line chart with point
    mark: { 
      type: "line", 
      point: true, 
      tooltip: true 
    },
    encoding: {
      x: { 
        field: "year", 
        type: "nominal", 
        title: "Year" 
      },
      y: { 
        field: "sales_amount", 
        type: "quantitative", 
        aggregate: "sum", 
        title: "Yearly Sales (Millions)" 
      },
      color: { 
        field: "genre", 
        type: "nominal",
        title: "Genre"
      },
      
      tooltip: [
        { field: "year", type: "nominal", title: "Year" },
        { field: "genre", type: "nominal", title: "Genre" },
        { field: "sales_amount", aggregate: "sum", type: "quantitative", format: ".2f", title: "Sales (M)" }
      ]
    }
  };

  // Visualization 2-2
  const vis2_q2 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 500, height: 300,
    data: { values: data },
    mark: { type: "area", tooltip: true },
    encoding: {
      x: { field: "year", type: "nominal", title: "Year" },
      y: { field: "sales_amount", type: "quantitative", aggregate: "sum", title: "Total Sales" },
      color: { field: "platform", type: "nominal" },
      tooltip: [
        { field: "year", type: "nominal" },
        { field: "platform", type: "nominal" },
        { field: "sales_amount", aggregate: "sum", type: "quantitative", format: ".2f" }
      ]
    }
  };

    const vis3_q1 = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      data: { values: data },
      transform: [
        {
          aggregate: [
            { op: "sum", field: "sales_amount", as: "total_sales" }
          ],
          groupby: ["sales_region", "platform"]
        },
        {
          window: [
            { op: "rank", as: "rank" }
          ],
          sort: [
            { field: "total_sales", order: "descending" }
          ],
          groupby: ["sales_region"]
        },
        { filter: "datum.rank <= 10" }
      ],
      mark: {
        type: "circle",
        size: 100,
        opacity: 0.8,
        tooltip: true
      },
      encoding: {
        y: {
          field: "platform",
          type: "nominal",
          sort: "-x",
          title: "Platform"
        },
        x: {
          field: "total_sales",
          type: "quantitative",
          title: "Total Sales (Millions)"
        },
        color: {
          field: "platform",
          type: "nominal",
          title: "Platform",
          scale: { scheme: "tableau20" } 
        },
        column: {
          field: "sales_region",
          type: "nominal",
          title: "Region",
          sort: ["na_sales", "eu_sales", "jp_sales", "other_sales"]
        },
        tooltip: [
          { field: "sales_region", type: "nominal", title: "Region" },
          { field: "platform", type: "nominal", title: "Platform" },
          { field: "total_sales", type: "quantitative", title: "Sales (M)", format: ".2f" },
          { field: "rank", type: "quantitative", title: "Regional Rank" }
        ]
      }
    };

    const vis3_q2 = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: 600,
      height: 400,
      data: { values: data },
      transform: [
        // to calculate a ranking
        {
          joinaggregate: [
            { op: "sum", field: "sales_amount", as: "Global_Total" }
          ],
          groupby: ["platform"]
        },
        // give them the ranking
        {
          window: [{ op: "dense_rank", as: "rank" }],
          sort: [{ field: "Global_Total", order: "descending" }]
        },
        // filter top 10
        { filter: "datum.rank <= 10" }
      ],
      mark: "bar",
      encoding: {
        x: {
          field: "platform",
          type: "nominal",
          title: "Platform (Top 10)",
          sort: { field: "sales_amount", op: "sum", order: "descending" },
          axis: { labelAngle: 0 }
        },
        y: {
          field: "sales_amount",
          type: "quantitative",
          aggregate: "sum",
          stack: "normalize",
          axis: { format: "%", title: "Regional Sales Share" }
        },
        color: {
          field: "sales_region",
          type: "nominal",
          title: "Region",
          scale: { scheme: "category10" }
        },
        tooltip: [
          { field: "platform", type: "nominal" },
          { field: "sales_region", type: "nominal" },
          { field: "sales_amount", aggregate: "sum", type: "quantitative", title: "Sales (M)" }
        ]
      }
    };

    const vis4_q1 = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: 500,
      height: 400,
      data: { values: data },
      transform: [
        {
          aggregate: [
            { op: "sum", field: "sales_amount", as: "total_sales" }
          ],
          groupby: ["genre", "sales_region"]
        },
        {
          joinaggregate: [{ op: "sum", field: "total_sales", as: "region_total" }],
          groupby: ["sales_region"]
        }
      ],
      mark: { type: "point", size: 200, filled: true },
      encoding: {
        x: {
          field: "total_sales",
          type: "quantitative",
          title: "Total Sales by Genre (Millions)",
          scale: { type: "log" } 
        },
        y: {
          field: "sales_region",
          type: "nominal",
          title: "Region",
          axis: {

            labelColor: {
              condition: { test: "datum.value === 'jp_sales'", value: "#e60012" },
              value: "black"
            },
            labelFontSize: {
              condition: { test: "datum.value === 'jp_sales'", value: 14 },
              value: 11
            },
            labelFontWeight: {
              condition: { test: "datum.value === 'jp_sales'", value: "bold" },
              value: "normal"
            }
          }
        },
        color: {
          condition: {
            test: "datum.genre === 'Role-Playing'",
            value: "#e74c3c" 
          },
          value: "#bdc3c7"
        },
        size: {
          field: "total_sales",
          type: "quantitative",
          legend: null
        },
        tooltip: [
          { field: "genre", type: "nominal" },
          { field: "sales_region", type: "nominal" },
          { field: "total_sales", type: "quantitative", format: ".2f" }
        ]
      }
    };

    const vis4_q2 = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      data: { values: data },
      transform: [
        {
          calculate: "datum.publisher === 'Nintendo' ? 'Nintendo' : 'Others'",
          as: "Company"
        }
      ],
      facet: {
        column: {
          field: "sales_region",
          type: "nominal",
          title: "Nintendo's Market Share by Region",
          sort: ["na_sales", "eu_sales", "other_sales", "jp_sales"],
          header: {
            labelColor: {
              condition: {test: "datum.value === 'jp_sales'", value: "#e60012"},
              value: "black"
            },
            labelFontWeight: {
              condition: {test: "datum.value === 'jp_sales'", value: "bold"},
              value: "normal"
            },
            labelFontSize: 14
          }
        }
      },
      spec: {
        width: 140,
        height: 140,
        mark: { type: "arc", innerRadius: 45, stroke: "#fff" },
        encoding: {
          theta: {
            field: "sales_amount",
            type: "quantitative",
            aggregate: "sum"
          },
          color: {
            field: "Company",
            type: "nominal",
            scale: { 
              domain: ["Nintendo", "Others"], 
              range: ["#e60012", "#d1d8e0"] 
            }
          },
          tooltip: [
            { field: "sales_region", type: "nominal", title: "Region" },
            { field: "Company", type: "nominal", title: "Publisher" },
            { field: "sales_amount", aggregate: "sum", type: "quantitative", format: ".2f" }
          ]
        }
      },
      resolve: { scale: { theta: "independent" } },
      config: {
        view: { stroke: null }
      }
    };
  

  // rendering
  vegaEmbed("#view", vis1_q1);
  vegaEmbed("#view2", vis1_q2);
  vegaEmbed("#view3", vis2_q1);
  vegaEmbed("#view4", vis2_q2);
  vegaEmbed("#view5", vis3_q1);
  vegaEmbed("#view6", vis3_q2);
  vegaEmbed("#view7", vis4_q1);
  vegaEmbed("#view8", vis4_q2);
});

async function render(viewID, spec) {
  const result = await vegaEmbed(viewID, spec);
  result.view.run();
}
