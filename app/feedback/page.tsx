declare global {
  namespace JSX {
    interface IntrinsicElements {
      "widget-web-component": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        projectid: string;
        theme: string;
      };
    }
  }
}
export default function Feedback() {
  return (
    <>
      <div className="mx-9">
        <widget-web-component
          theme="jungleJazz"
          website-name="test"
          projectid="cm275ni0900018xtki41o0oa4"
        />
      </div>

      <script async src="https://widget.opinify.in/widget.umd.js"></script>
    </>
  );
}

