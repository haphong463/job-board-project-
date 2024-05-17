import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";

const Forms = () => {
  return (
    <Row>
      <Col>
        {/* --------------------------------------------------------------------------------*/}
        {/* Card for Blog Post Form*/}
        {/* --------------------------------------------------------------------------------*/}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-pencil me-2"> </i>
            Create Blog Post
          </CardTitle>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="postTitle">Title</Label>
                <Input
                  id="postTitle"
                  name="title"
                  placeholder="Enter the title of the blog post"
                  type="text"
                />
              </FormGroup>
              <FormGroup>
                <Label for="postContent">Content</Label>
                <Input
                  id="postContent"
                  name="content"
                  placeholder="Write your blog content here"
                  type="textarea"
                />
              </FormGroup>
              <FormGroup>
                <Label for="postCategory">Category</Label>
                <Input id="postCategory" name="category" type="select">
                  <option>Technology</option>
                  <option>Health</option>
                  <option>Lifestyle</option>
                  <option>Business</option>
                  <option>Travel</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="postTags">Tags</Label>
                <Input
                  id="postTags"
                  name="tags"
                  placeholder="Enter tags separated by commas"
                  type="text"
                />
              </FormGroup>
              <FormGroup>
                <Label for="postImage">Upload Image</Label>
                <Input id="postImage" name="image" type="file" />
              </FormGroup>
              <Button className="mt-2">Submit</Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Forms;
