import React from "react";

export default function page({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  return (
    <div className="flex flex-col items-start gap-3">
      <h1>
        Space Id {" - "} {projectId}
      </h1>
      <h1>Feedback Widget Embed Example</h1>
      <p>Copy the following code and paste it accordingly in your project</p>
      <pre>
        {`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .btn {
        background-color: red !important;
      }
    </style>
  </head>
  <body>
    <div
      data-space-name="DevSoc"
      data-space-description="Share your thoughts and suggestions about our product"
      data-space-image="https://example.com/feedback-hub-image.jpg"
      data-buton-text="Share Feedback"
      id="feedbackio-feedback-widget"
      data-classname="btn"
      data-spaceid="your space id"
    ></div>
    <script src="https://cdn.jsdelivr.net/gh/ArnabChatterjee20k/feedbackio-widget@refs/heads/master/feedback-widget-cdn/feedback-bundle.js"></script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/ArnabChatterjee20k/feedbackio-widget@refs/heads/master/feedback-widget-cdn/feedback-style.css"
    />
  </body>
</html>        `}
      </pre>
    </div>
  );
}
