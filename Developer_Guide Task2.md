# Developer Guide: Changes Introduced with Task 2

## Overview

In this update, a new feature was added to the application to allow users to click on a cell to extract metadata

## Detailed Changes

### 1. Added SVG layer for d3 circles and tooltip layer for metadata
- **File Modified**: `client/src/components/Graph/Graph.tsx/`
- **Description**: 
  - d3 circles were supposed to lay on top of cells but there is a conversion issue of the coordinates. 

```typescript
  <svg
          id="overlay-svg"
          width={viewport.width}
          height={viewport.height}
          style={{
            ...COMMON_CANVAS_STYLE,
            opacity: isSpatialMode(this.props) ? `${dotOpacity}%` : "100%",
            mixBlendMode: "multiply",
            pointerEvents: "auto", // Ensure the SVG accepts pointer events.
          }}
        />
        // adapt more for coorporate colors etc.
        {tooltipText && hoveredPointScreen && (
          <div
            style={{
              position: "absolute",
              left: hoveredPointScreen[0] + 10,
              top: hoveredPointScreen[1] + 10,
              backgroundColor: "white",
              border: "1px solid #ccc",
              padding: "5px",
              zIndex: 5,
            }}
          >
            {tooltipText}
          </div>
        )}
```

### 2. render circles and manage events

- The user should be able to hover over d3 circles and the circle gets highlighted
- clicking on the cells: a tooltip opens with data

```typescript
  renderOverlayCircles(): void {
    // select layer where circles are added
    const svg = d3.select<SVGSVGElement, OverlayData>("#overlay-svg"); 
  
    if (!this.cachedAsyncProps || !this.cachedAsyncProps.positions) {
      return;
    }
    
    const positions = this.cachedAsyncProps.positions;
    const data: OverlayData[] = [];
    // Build the data array, ensuring each point is typed as [number, number]
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < positions.length / 2; i++) {
      const point: [number, number] = [positions[2 * i], positions[2 * i + 1]]; // positions are saved in Array [x0,y0,x1,y1...]
      const screenPoint = this.mapPointToScreen(point); // maybe mapPoint is not correctly converting coordinates
      data.push({
        index: i,
        screenX: screenPoint[0],
        screenY: screenPoint[1],
      });
    }
    
    // capture the outer React component context.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const owner = this;

    // bind data to circles.
    const circles = svg
      .selectAll<SVGCircleElement, OverlayData>("circle.point")
      .data(data, (d: OverlayData) => d.index.toString());
    
    // Enter new circles.
    circles
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d: OverlayData): number => d.screenX)
      .attr("cy", (d: OverlayData): number => d.screenY)

      .attr("r", 6) // Adjust radius as desired.
      .style("fill", "none")
      .style("pointer-events", "all") // Allow these circles to capture mouse events.
      // eslint-disable-next-line prefer-arrow-callback, func-names
      .on("mouseover", function mouseOver(this: SVGCircleElement, d: OverlayData): void {
        d3.select(this)
          .style("fill", "orange") // change color
          .style("opacity", "0.8");
        owner.setState({
          hoveredPointIndex: d.index,
          hoveredPointScreen: [d.screenX, d.screenY],
          tooltipText: `Cell ${d.index}`,
        });
      })
      // eslint-disable-next-line prefer-arrow-callback, func-names
      .on("mouseout", function mouseOut(this: SVGCircleElement, d: OverlayData): void {
        d3.select(this).style("fill", "none");
        owner.setState({
          hoveredPointIndex: null,
          tooltipText: null,
        });
      })
      // eslint-disable-next-line prefer-arrow-callback, func-names
      .on("click", function mouseClick(this: SVGCircleElement, d: OverlayData): void {
        const cellData = owner.getCellMetadata(d.index);
        owner.setState({
          tooltipText: `Cell ${d.index}:\n${JSON.stringify(cellData, null, 2)}` // metadata added to tooltip string
        });
      });
    
    // update existing circles.
    circles
      .attr("cx", (d: OverlayData): number => d.screenX)
      .attr("cy", (d: OverlayData): number => d.screenY);
    
    // remove old circles.
    circles.exit().remove();
  }

```

- **Problems**:
  - mapPointToScreen might not be the correct transformation of the coordinates.

### 3. extract metadata

- when clicking on the circles the index of the cell is extracted. With that index the metadata is extracted. 

```typescript
  getCellMetadata(cellIndex: number): Record<string, any> {
    // First, check that obsByName exists
    // eslint-disable-next-line react/destructuring-assignment
    const obsByName = this.props.annoMatrix.schema.annotations.obsByName as Record<string, any>;
    if (!obsByName) {
      return {};
    }
    const cellData: Record<string, any> = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obsByName) {
      if (Object.prototype.hasOwnProperty.call(obsByName, key)) {
        const col = obsByName[key];
        // Many columns store their values in a "data" property.
        // If that exists and is an array, use that.
        if (col && Array.isArray(col.data)) {
          cellData[key] = col.data[cellIndex];
        } else if (Array.isArray(col)) {
          // Fallback: if the column itself is an array.
          cellData[key] = col[cellIndex];
        } else {
          // Otherwise, if there's no array, return the column as is.
          cellData[key] = col;
        }
      }
    }
    return cellData;
  }
```