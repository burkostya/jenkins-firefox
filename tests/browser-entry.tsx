import {mount} from '../src/mount.tsx';
import {parseLocation} from '../src/api.ts';
mount(parseLocation((window as any).__testLocation || 'https://jenkins.test/job/bus_backend/job/BUS-4497-agent-flow-improvements/'));

import * as flow from '../src/flow-table.ts';
(window as any).__flowTest=flow;
