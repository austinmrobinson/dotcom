import Image from "next/image";
import Button, { IconButton } from "./components/button";
import { Filter } from "react-feather";
import TextInput from "./components/input";

export default function Home() {
  return (
    <div>
      test
      <TextInput id="2" label="Blah" />
      <Button>Test</Button>
      <Button variant="secondary" size="medium">
        Test
      </Button>
      <Button variant="tertiary" size="small">
        Test
      </Button>
      <Button variant="text">Test</Button>
      <IconButton>
        <Filter size="16" />
      </IconButton>
      <IconButton variant="secondary" size="medium">
        <Filter size="16" />
      </IconButton>
      <IconButton variant="tertiary" size="small">
        <Filter />
      </IconButton>
      <IconButton variant="text">
        <Filter size="16" />
      </IconButton>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non
      est quis metus mollis rutrum viverra dignissim lacus. Nulla eu fermentum
      massa, nec auctor dolor. Etiam at maximus orci. Sed sit amet scelerisque
      felis. Quisque facilisis elit et finibus dictum. Quisque blandit arcu id
      libero auctor interdum. Nullam ut magna nec enim tempus tincidunt. Fusce
      commodo at mi a auctor. Curabitur id nisl convallis, eleifend lorem ac,
      dictum enim. Cras ex neque, fermentum in ipsum et, maximus pulvinar
      libero. Fusce eu suscipit velit. Morbi interdum tincidunt justo, sed
      pulvinar enim. In auctor, leo sed tempor gravida, nisi quam ultricies
      dolor, et tristique sem nibh non massa. Pellentesque habitant morbi
      tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas
      fermentum ante ipsum, in venenatis velit semper ut. Pellentesque molestie
      lectus non varius commodo. Ut non erat quis dolor porta accumsan. Nullam
      iaculis ultrices ultricies. Etiam ut leo arcu. Donec vitae massa at est
      viverra condimentum ut vel metus. Sed nulla dolor, commodo nec lacus
      vitae, mattis placerat risus. Lorem ipsum dolor sit amet, consectetur
      adipiscing elit. In ac rhoncus turpis. Proin a ultricies elit. Cras
      elementum metus nec pellentesque placerat. Quisque nec magna vulputate
      enim volutpat fermentum eget a orci. Pellentesque sed lorem nisl. Integer
      non libero id nunc lacinia venenatis. In cursus purus laoreet urna
      tristique accumsan. Maecenas nec feugiat eros, eu dignissim nisi. Nullam
      porta sapien in pretium suscipit. Vestibulum ut est auctor, tristique
      ipsum vel, maximus neque. Donec cursus dui et nisl scelerisque ultricies.
      Ut mollis justo non consectetur consectetur. Sed suscipit in erat sed
      dictum. Pellentesque habitant morbi tristique senectus et netus et
      malesuada fames ac turpis egestas. Curabitur mauris quam, hendrerit
      rhoncus quam eget, mattis efficitur mi. Suspendisse potenti. In hac
      habitasse platea dictumst. Praesent ac aliquet nibh. Nulla tempus mattis
      mollis. In varius consequat vehicula. Etiam quis suscipit metus. Lorem
      ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel lorem
      ut dui imperdiet placerat. Cras ut sollicitudin nunc, a tincidunt purus.
      Integer accumsan metus vulputate vulputate placerat. Sed quam eros,
      vulputate vitae pellentesque vel, gravida eget magna. Cras auctor ligula
      sit amet pellentesque molestie. Vivamus purus turpis, laoreet eget
      eleifend nec, semper quis leo. Aenean vel lacus aliquet, tempor dui a,
      egestas magna. Suspendisse quis magna rhoncus, luctus risus eu, imperdiet
      ipsum. Donec accumsan urna non neque pharetra, at ullamcorper tellus
      ornare. Phasellus pulvinar suscipit semper. In eget augue quis velit
      placerat ullamcorper. Vivamus nec nulla vehicula, volutpat libero rutrum,
      suscipit neque. Maecenas at ligula arcu. Vivamus tristique rhoncus sapien
      vitae vestibulum. Donec ut tempus nunc.
    </div>
  );
}
