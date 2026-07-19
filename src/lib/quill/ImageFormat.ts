import { Quill } from "react-quill";

const BaseImageFormat = Quill.import("formats/image");

const ImageFormatAttributesList = [
  "alt",
  "height",
  "width",
  "style",
];

export class ImageFormat extends BaseImageFormat {
  domNode: any;

  // @ts-ignore
  static formats(domNode) {
    // tslint:disable-next-line: only-arrow-functions
    return ImageFormatAttributesList.reduce(function (
      formats,
      attribute
    ) {
      if (domNode.hasAttribute(attribute)) {
        // @ts-ignore
        formats[attribute] =
          domNode.getAttribute(attribute);
      }
      return formats;
    },
    {});
  }
  // @ts-ignore
  format(name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
