Design Tokens in Figma — The Full Story

What they actually are
"Design tokens" in Figma means Figma Variables — named containers that store a single reusable value. 

There are four types:                                                                                                                                                 
  ┌─────────┬────────────┬─────────────────────────────────────┐
  │  Type   │  Example   │              Used for               │
  ├─────────┼────────────┼─────────────────────────────────────┤
  │ Color   │ #3B82F6  │ Palettes, theming (light/dark mode) │
  ├─────────┼────────────┼─────────────────────────────────────┤
  │ Number  │ 16, 8.5    │ Spacing, sizing, border-radius      │
  ├─────────┼────────────┼─────────────────────────────────────┤                             
  │ String  │ "Inter"    │ Font families, localization strings │                           
  ├─────────┼────────────┼─────────────────────────────────────┤
  │ Boolean │ true/false │ Toggling visibility in prototypes   │
  └─────────┴────────────┴─────────────────────────────────────┘

  Variables are organized into collections (logical groups like "Colors", "Spacing") and   
  support modes (e.g., one variable with different values for "Light" and "Dark" themes).  

  Variables vs. Styles — a critical distinction

  These are not the same thing, and the course content I created somewhat blurs this:      

  ┌──────────┬───────────────────────────────┬─────────────────────────────────────────┐   
  │          │           Variables           │                 Styles                  │   
  ├──────────┼───────────────────────────────┼─────────────────────────────────────────┤   
  │ Holds    │ A single raw value            │ A composite bundle of properties        │   
  ├──────────┼───────────────────────────────┼─────────────────────────────────────────┤   
  │ Example  │ primary-500: #3B82F6          │ A Text Style combining font + size +    │   
  │          │                               │ weight + line-height                    │   
  ├──────────┼───────────────────────────────┼─────────────────────────────────────────┤
  │ Modes    │ Yes (light/dark)              │ No                                      │   
  ├──────────┼───────────────────────────────┼─────────────────────────────────────────┤   
  │ Aliasing │ Yes (one variable can         │ No                                      │   
  │          │ reference another)            │                                         │   
  ├──────────┼───────────────────────────────┼─────────────────────────────────────────┤   
  │ Supports │ Solid colors, numbers,        │ Gradients, shadows, blurs, typography   │   
  │          │ strings, booleans             │ combos, image fills                     │   
  └──────────┴───────────────────────────────┴─────────────────────────────────────────┘   

  The best practice is to use them together: Variables as the atomic foundation, Styles for
   composite treatments that variables can't express (like a text style that bundles font  
  family + size + weight + line-height).

  Figma has confirmed Styles are not being deprecated — they're complementary.

  Do designers need to manually create them? YES.

  Variables do not exist automatically. A designer must:
  1. Open the Local Variables panel in Figma
  2. Click "Create variable" and choose a type
  3. Name it (e.g., color/primary/500)
  4. Set its value
  5. Optionally organize into collections and modes
  6. Optionally create aliases (e.g., color/bg/surface points to color/neutral/100)        
  7. Then apply those variables to layers/frames in their design

  A Figma file where a designer just picked colors from the color picker and typed pixel   
  values without creating variables will have zero extractable tokens. This is extremely   
  common in practice — many teams, especially smaller ones, don't use the Variables feature
   at all.

  This is the most significant practical limitation for the whole Figma MCP workflow. If   
  BulkSource's designers haven't set up Figma Variables, the get_variable_defs tool will   
  return little to nothing.

  ---
  How the MCP Tools Actually Work

  The actual tool names (corrected from the course content)

  The course content uses the older/informal names. Here's what the Figma MCP server       
  actually provides (13 tools total):

  Design-to-Code Tools:

  ┌────────────────────┬────────────────────────────────────────────────────────────────┐  
  │        Tool        │                          What it does                          │  
  ├────────────────────┼────────────────────────────────────────────────────────────────┤  
  │                    │ The main tool. Returns a structured React+Tailwind             │  
  │ get_design_context │ representation of your Figma selection. Can be prompted to     │  
  │                    │ output Vue, HTML+CSS, iOS, etc.                                │  
  ├────────────────────┼────────────────────────────────────────────────────────────────┤  
  │ get_variable_defs  │ Returns variables and styles applied to the current selection  │  
  │                    │ — not the entire file's variable library                       │  
  ├────────────────────┼────────────────────────────────────────────────────────────────┤  
  │ get_screenshot     │ Takes a visual screenshot of the selection for layout fidelity │  
  ├────────────────────┼────────────────────────────────────────────────────────────────┤  
  │ get_metadata       │ Returns sparse XML with layer IDs, names, types, positions —   │  
  │                    │ useful for large designs                                       │  
  └────────────────────┴────────────────────────────────────────────────────────────────┘  

  Code Connect Tools:

  ┌──────────────────────────────┬──────────────────────────────────────────────────────┐  
  │             Tool             │                     What it does                     │  
  ├──────────────────────────────┼──────────────────────────────────────────────────────┤  
  │ get_code_connect_map         │ Returns the mapping table: Figma node ID → code      │  
  │                              │ component location/name                              │  
  ├──────────────────────────────┼──────────────────────────────────────────────────────┤  
  │ add_code_connect_map         │ Adds new mappings between Figma nodes and code       │  
  │                              │ components                                           │  
  ├──────────────────────────────┼──────────────────────────────────────────────────────┤  
  │ get_code_connect_suggestions │ Auto-detects and suggests Figma-to-code component    │  
  │                              │ mappings                                             │  
  ├──────────────────────────────┼──────────────────────────────────────────────────────┤  
  │ send_code_connect_mappings   │ Confirms suggested Code Connect mappings             │  
  └──────────────────────────────┴──────────────────────────────────────────────────────┘  

  Other:

  ┌────────────────────────────┬────────────────────────────────────────────────────────┐  
  │            Tool            │                      What it does                      │  
  ├────────────────────────────┼────────────────────────────────────────────────────────┤  
  │ create_design_system_rules │ Creates rules files that help agents match your design │  
  │                            │  system                                                │  
  ├────────────────────────────┼────────────────────────────────────────────────────────┤  
  │ get_figjam                 │ Converts FigJam diagrams to XML                        │  
  ├────────────────────────────┼────────────────────────────────────────────────────────┤  
  │ generate_diagram           │ Generates FigJam from Mermaid syntax                   │  
  ├────────────────────────────┼────────────────────────────────────────────────────────┤  
  │ generate_figma_design      │ Generates design layers into Figma files               │  
  ├────────────────────────────┼────────────────────────────────────────────────────────┤  
  │ whoami                     │ Returns authenticated user identity                    │  
  └────────────────────────────┴────────────────────────────────────────────────────────┘  

  Key behavior of get_variable_defs

  This is selection-scoped. It only returns variables/styles applied to whatever is        
  currently selected. It does not dump the entire file's variable library. If nothing is   
  selected or the selection has no variables applied, you get empty results.

  ---
  Code Connect — How It Actually Works

  Code Connect is a bridge between Figma design components and your actual code components.
   When configured, Figma's Dev Mode shows real code snippets from your codebase instead of
   auto-generated approximations.

  Where it lives

  Code Connect is configured in your codebase, not in Figma. You create mapping files that 
  sit alongside your components, then publish them to Figma.

  Setup process

  1. Install: npm install --global @figma/code-connect@latest
  2. Run interactive setup: npx figma connect --token=YOUR_FIGMA_TOKEN
  3. It generates .figma.tsx mapping files like:

  import { Button } from "../ui/Button"
  import figma from "@figma/code-connect"

  figma.connect(
    Button,                                    // Your actual code component
    "https://www.figma.com/design/abc123...",  // Figma component URL
    {
      props: {
        variant: figma.enum("Variant", {
          Primary: "primary",
          Neutral: "neutral",
        }),
        hasIcon: figma.boolean("Has Icon"),
      },
      example: (props) => <Button variant={props.variant} />,
    }
  )

  4. Publish: npx figma connect publish --token=YOUR_TOKEN
  5. Config file: figma.config.json at your project root configures paths, parser type,    
  import paths.

  How it integrates with MCP

  When get_design_context runs and Code Connect mappings exist for the selected components,
   it wraps those components in <CodeConnectSnippet> tags containing the actual import     
  statements and usage code from your codebase. This means Claude generates code using your
   real components, not generic HTML/Tailwind.

  get_code_connect_map returns just the lookup table — Figma node ID → { codeConnectSrc,   
  codeConnectName } — so Claude knows which Figma component maps to which file in your     
  repo.

  Requirements

  - Figma Organization or Enterprise plan (not free or Professional)
  - Full or Dev seat
  - Supports: React, React Native, HTML (Angular, Vue, Web Components), Storybook, SwiftUI,
   Jetpack Compose

  ---
  What This Means for the Course Content

  There are a few things in the Session 3 materials that could be more precise:

  1. The tool names — I used get_code, get_variables, get_code_connect_map in the slides.  
  The actual names are get_design_context, get_variable_defs, and the same
  get_code_connect_map. This is a minor issue since students will see the real names when  
  they use the tools.
  2. The token extraction framing — The course content implies "share a Figma URL and      
  Claude extracts tokens." In reality, get_variable_defs is selection-scoped and only      
  returns variables that are actually applied to the selected layers. If BulkSource's Figma
   files don't use Variables, this exercise will produce empty results. The course
  materials do have a note about this ("If get_variables returns few or no tokens...") but 
  it could be more prominent.
  3. Code Connect is more complex than the slide implies — it requires
  Organization/Enterprise Figma plans, a CLI setup, .figma.tsx mapping files in your       
  codebase, and a publish step. It's not something you just "turn on." For a team of 22,   
  this is likely a later optimization, not a day-one activity.