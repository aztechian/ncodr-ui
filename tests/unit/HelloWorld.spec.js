import { expect } from 'chai';
import { shallow } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Please choose a queue from the left sidebar';
    const wrapper = shallow(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.find('.hello h2').text()).to.include(msg);
  });
});
