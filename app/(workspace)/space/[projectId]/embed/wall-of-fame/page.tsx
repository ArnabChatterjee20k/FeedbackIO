import React from "react";

export default function page({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  return (
    <div className="flex flex-col items-start gap-3">
      <h1>
        Space Id {" - "} {projectId}
      </h1>
      <h1>Wall of Fame Embed Widget Example</h1>
      <p>Copy the following code and paste it accordingly in your project</p>
      <pre>
        {`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="feedbackio-wall-of-fame" data-spaceid="your space id"></div>
</body>
<script type="module" src="https://cdn.jsdelivr.net/gh/ArnabChatterjee20k/feedbackio-widget@latest/wall-of-fame-cdn/wall-bundle.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ArnabChatterjee20k/feedbackio-widget@master/wall-of-fame-cdn/wall-style.css">
</html>
        `}
      </pre>

      <h1>Embed API url - {`https://feedback-io-beta.vercel.app/api/<your space url>/wall-of-fame`}</h1>
      <p>The wall of fame refreshes every 2 hours</p>
    </div>
  );
}
