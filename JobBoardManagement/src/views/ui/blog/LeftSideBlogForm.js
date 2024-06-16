import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import { Col, FormGroup, FormText, Input, Label, Row } from "reactstrap";
import { slugify } from "../../../utils/functions/convertToSlug";

export function LeftSideBlogForm(props) {
  return (
    <Col lg={8}>
      <Row>
        <Col md={12}>
          <FormGroup>
            <div className="d-flex justify-content-between">
              <Label for="postTitle">
                Title <span className="text-danger">*</span>
              </Label>
              <FormText>{slugify(props.watch("title"))}</FormText>
            </div>
            <Controller
              name="title"
              control={props.control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="postTitle"
                  placeholder="Enter the title of the blog post"
                  type="text"
                  invalid={!!props.errors.title}
                />
              )}
            />
            {props.errors.title && (
              <FormText color="danger">{props.errors.title.message}</FormText>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="citation">
              Citation <span className="text-danger">*</span>
            </Label>
            <Controller
              name="citation"
              control={props.control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="citation"
                  placeholder="Enter the citation of the blog post"
                  type="textarea"
                  invalid={!!props.errors.citation}
                />
              )}
            />
            {props.errors.citation && (
              <FormText color="danger">
                {props.errors.citation.message}
              </FormText>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="content">
              Content <span className="text-danger">*</span>
            </Label>
            <Editor
              apiKey={process.env.REACT_APP_TINYMCE_KEY}
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount ",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
              }}
              initialValue={
                props.isEdit ? props.isEdit.content : "Welcome to TinyMCE!"
              }
              onEditorChange={(newValue, editor) =>
                props.setValue("content", newValue, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              id="content"
            />
            {props.errors.content && (
              <FormText color="danger">{props.errors.content.message}</FormText>
            )}
          </FormGroup>
        </Col>
      </Row>
    </Col>
  );
}
